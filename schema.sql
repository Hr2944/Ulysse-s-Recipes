


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "hypopg" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "index_advisor" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "extensions";






CREATE TYPE "public"."recipe_cost" AS ENUM (
    'bon marché',
    'moyen',
    'cher'
);


ALTER TYPE "public"."recipe_cost" OWNER TO "postgres";


CREATE TYPE "public"."recipe_difficulty" AS ENUM (
    'facile',
    'moyen',
    'difficile'
);


ALTER TYPE "public"."recipe_difficulty" OWNER TO "postgres";


CREATE TYPE "public"."recipe_status" AS ENUM (
    'draft',
    'published'
);


ALTER TYPE "public"."recipe_status" OWNER TO "postgres";


CREATE TYPE "public"."recipe_type" AS ENUM (
    'entrée',
    'plat',
    'dessert',
    'boisson',
    'accompagnement'
);


ALTER TYPE "public"."recipe_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_total_time"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
  -- Calcule la somme de prep_time_minutes et cook_time_minutes.
  -- COALESCE est une sécurité pour traiter les valeurs NULL comme 0 si jamais vos contraintes changent.
  NEW.total_time_minutes := COALESCE(NEW.prep_time_minutes, 0) + COALESCE(NEW.cook_time_minutes, 0);
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."calculate_total_time"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_recipe_with_relations"("p_author_id" "uuid", "p_recipe_data" "jsonb", "p_ingredients" "jsonb", "p_steps" "jsonb") RETURNS "uuid"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    new_recipe_id uuid;
BEGIN
    -- 1. Insert Recipe
    INSERT INTO public.recipes (
        author_id, title, description, prep_time_minutes, cook_time_minutes, 
        servings, difficulty, cost, type, status, is_vegetarian, is_vegan, 
        cover_image_url, average_rating, embedding
    )
    VALUES (
        p_author_id,
        p_recipe_data->>'title',
        p_recipe_data->>'description',
        (p_recipe_data->>'prep_time_minutes')::integer,
        (p_recipe_data->>'cook_time_minutes')::integer,
        (p_recipe_data->>'servings')::integer,
        (p_recipe_data->>'difficulty')::public.recipe_difficulty,
        (p_recipe_data->>'cost')::public.recipe_cost,
        (p_recipe_data->>'type')::public.recipe_type,
        (p_recipe_data->>'status')::public.recipe_status,
        (p_recipe_data->>'is_vegetarian')::boolean,
        (p_recipe_data->>'is_vegan')::boolean,
        p_recipe_data->>'cover_image_url',
        0.0,
        (p_recipe_data->>'embedding')::vector
    )
    RETURNING id INTO new_recipe_id;

    -- 2. Bulk Insert Ingredients (No Loop)
    INSERT INTO public.ingredients (recipe_id, name, quantity, unit, "order")
    SELECT 
        new_recipe_id,
        name,
        quantity,
        unit,
        "order"
    FROM jsonb_to_recordset(p_ingredients) AS x(
        name text, 
        quantity numeric, 
        unit text, 
        "order" smallint
    );

    -- 3. Bulk Insert Steps (No Loop)
    INSERT INTO public.steps (recipe_id, step_number, description)
    SELECT 
        new_recipe_id,
        step_number,
        description
    FROM jsonb_to_recordset(p_steps) AS x(
        step_number smallint, 
        description text
    );

    RETURN new_recipe_id;
END;
$$;


ALTER FUNCTION "public"."create_recipe_with_relations"("p_author_id" "uuid", "p_recipe_data" "jsonb", "p_ingredients" "jsonb", "p_steps" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."force_child_metadata_sync"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    -- Ignore whatever the user tried to set for these columns.
    -- Force them to look up the TRUE values from the parent recipe.
    SELECT status, author_id 
    INTO NEW.recipe_status, NEW.recipe_author_id
    FROM "public"."recipes"
    WHERE id = NEW.recipe_id;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."force_child_metadata_sync"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_rating_incremental"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'extensions', 'pg_temp'
    AS $$
DECLARE
    diff_count int;
    diff_sum int;
BEGIN
    -- Determine the difference based on operation type
    IF (TG_OP = 'INSERT') THEN
        diff_count := 1;
        diff_sum := NEW.rating;
        
        -- Update the recipe using minimal locking math
        UPDATE "public"."recipes"
        SET 
            rating_count = rating_count + diff_count,
            rating_sum = rating_sum + diff_sum,
            average_rating = ROUND((rating_sum + diff_sum)::numeric / (rating_count + diff_count), 1)
        WHERE id = NEW.recipe_id;
        
        RETURN NEW;

    ELSIF (TG_OP = 'DELETE') THEN
        diff_count := -1;
        diff_sum := -OLD.rating;
        
        UPDATE "public"."recipes"
        SET 
            rating_count = GREATEST(rating_count + diff_count, 0), -- Prevent negative
            rating_sum = GREATEST(rating_sum + diff_sum, 0),
            average_rating = CASE 
                WHEN (rating_count + diff_count) > 0 
                THEN ROUND((rating_sum + diff_sum)::numeric / (rating_count + diff_count), 1) 
                ELSE 0 
            END
        WHERE id = OLD.recipe_id;
        
        RETURN OLD;

    ELSIF (TG_OP = 'UPDATE') THEN
        -- Only if the rating value actually changed
        IF OLD.rating IS DISTINCT FROM NEW.rating THEN
            diff_sum := NEW.rating - OLD.rating;
            
            UPDATE "public"."recipes"
            SET 
                rating_sum = rating_sum + diff_sum,
                average_rating = ROUND((rating_sum + diff_sum)::numeric / rating_count, 1)
            WHERE id = NEW.recipe_id;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."handle_new_rating_incremental"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'extensions', 'pg_temp'
    AS $$BEGIN
                                                                                                  INSERT INTO public.profiles (id, username)
                                                                                                    VALUES (new.id, new.raw_user_meta_data->>'display_name');
                                                                                                      RETURN new;
                                                                                                      END;$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."recipes" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "cover_image_url" "text" NOT NULL,
    "prep_time_minutes" integer NOT NULL,
    "cook_time_minutes" integer NOT NULL,
    "servings" integer DEFAULT 4 NOT NULL,
    "difficulty" "public"."recipe_difficulty" NOT NULL,
    "cost" "public"."recipe_cost" NOT NULL,
    "type" "public"."recipe_type" NOT NULL,
    "is_vegetarian" boolean DEFAULT false NOT NULL,
    "is_vegan" boolean DEFAULT false NOT NULL,
    "status" "public"."recipe_status" DEFAULT 'draft'::"public"."recipe_status" NOT NULL,
    "average_rating" numeric(2,1) DEFAULT 0.0 NOT NULL,
    "author_id" "uuid" NOT NULL,
    "total_time_minutes" integer,
    "embedding" "extensions"."vector"(384),
    "rating_count" integer DEFAULT 0 NOT NULL,
    "rating_sum" integer DEFAULT 0 NOT NULL,
    CONSTRAINT "recipes_cook_time_minutes_check" CHECK (("cook_time_minutes" >= 0)),
    CONSTRAINT "recipes_prep_time_minutes_check" CHECK (("prep_time_minutes" >= 0)),
    CONSTRAINT "recipes_servings_check" CHECK (("servings" >= 0)),
    CONSTRAINT "recipes_total_time_minutes_check" CHECK (("total_time_minutes" >= 0))
);


ALTER TABLE "public"."recipes" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_recipes"("query_embedding" "extensions"."vector", "match_threshold" double precision, "match_count" integer) RETURNS SETOF "public"."recipes"
    LANGUAGE "sql"
    SET "search_path" TO 'public', 'extensions', 'pg_temp'
    AS $$
  select *
  from recipes
  where recipes.embedding <=> query_embedding < 1 - match_threshold
  order by recipes.embedding <=> query_embedding asc
  limit least(match_count, 200);
$$;


ALTER FUNCTION "public"."match_recipes"("query_embedding" "extensions"."vector", "match_threshold" double precision, "match_count" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."populate_metadata_on_insert"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    SELECT status, author_id 
    INTO NEW.recipe_status, NEW.recipe_author_id
    FROM "public"."recipes"
    WHERE id = NEW.recipe_id;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."populate_metadata_on_insert"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_recipe_metadata_to_children"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
    -- If the recipe's status or author changes, update all children
    IF (OLD.status IS DISTINCT FROM NEW.status) OR (OLD.author_id IS DISTINCT FROM NEW.author_id) THEN
        UPDATE "public"."ingredients"
        SET recipe_status = NEW.status, recipe_author_id = NEW.author_id
        WHERE recipe_id = NEW.id;

        UPDATE "public"."steps"
        SET recipe_status = NEW.status, recipe_author_id = NEW.author_id
        WHERE recipe_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_recipe_metadata_to_children"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_recipe_details"("p_recipe_id" "uuid", "p_recipe_data" "jsonb", "p_ingredients" "jsonb", "p_steps" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'extensions'
    AS $$
DECLARE
    v_uid uuid;
BEGIN
    -- Get the actual logged-in user ID securely
    v_uid := auth.uid();

    -- Check if user is logged in
    IF v_uid IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- 1. Update Main Recipe (Using v_uid, NOT a parameter)
    UPDATE public.recipes
    SET
        title = p_recipe_data->>'title',
        description = p_recipe_data->>'description',
        prep_time_minutes = (p_recipe_data->>'prep_time_minutes')::integer,
        cook_time_minutes = (p_recipe_data->>'cook_time_minutes')::integer,
        servings = (p_recipe_data->>'servings')::integer,
        difficulty = (p_recipe_data->>'difficulty')::public.recipe_difficulty,
        cost = (p_recipe_data->>'cost')::public.recipe_cost,
        type = (p_recipe_data->>'type')::public.recipe_type,
        status = (p_recipe_data->>'status')::public.recipe_status,
        is_vegetarian = (p_recipe_data->>'is_vegetarian')::boolean,
        is_vegan = (p_recipe_data->>'is_vegan')::boolean,
        cover_image_url = p_recipe_data->>'cover_image_url',
        embedding = (p_recipe_data->>'embedding')::vector,
        updated_at = now()
    WHERE
        id = p_recipe_id AND author_id = v_uid; -- SECURE CHECK

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Opération non autorisée ou recette non trouvée.';
    END IF;

    -- 2. Process Ingredients (Same logic, relying on recipe_id)
    -- Since we verified ownership of p_recipe_id above, we are safe here.
    
    -- A. DELETE
    DELETE FROM public.ingredients 
    WHERE recipe_id = p_recipe_id 
    AND id NOT IN (
        SELECT (x->>'id')::bigint 
        FROM jsonb_array_elements(p_ingredients) x 
        WHERE x->>'id' IS NOT NULL
    );

    -- B. UPDATE
    UPDATE public.ingredients AS dest
    SET 
        name = src.name,
        quantity = src.quantity,
        unit = src.unit,
        "order" = src."order"
    FROM (
        SELECT 
            (x->>'id')::bigint AS id,
            x->>'name' AS name,
            (x->>'quantity')::numeric AS quantity,
            x->>'unit' AS unit,
            (x->>'order')::smallint AS "order"
        FROM jsonb_array_elements(p_ingredients) x
        WHERE x->>'id' IS NOT NULL
    ) AS src
    WHERE dest.id = src.id AND dest.recipe_id = p_recipe_id;

    -- C. INSERT
    INSERT INTO public.ingredients (recipe_id, name, quantity, unit, "order")
    SELECT 
        p_recipe_id,
        x->>'name',
        (x->>'quantity')::numeric,
        x->>'unit',
        (x->>'order')::smallint
    FROM jsonb_array_elements(p_ingredients) x
    WHERE x->>'id' IS NULL;

    -- 3. Process Steps (Same logic)
    
    -- A. DELETE
    DELETE FROM public.steps 
    WHERE recipe_id = p_recipe_id 
    AND id NOT IN (
        SELECT (x->>'id')::bigint 
        FROM jsonb_array_elements(p_steps) x 
        WHERE x->>'id' IS NOT NULL
    );

    -- B. UPDATE
    UPDATE public.steps AS dest
    SET 
        step_number = src.step_number,
        description = src.description
    FROM (
        SELECT 
            (x->>'id')::bigint AS id,
            (x->>'step_number')::smallint AS step_number,
            x->>'description' AS description
        FROM jsonb_array_elements(p_steps) x
        WHERE x->>'id' IS NOT NULL
    ) AS src
    WHERE dest.id = src.id AND dest.recipe_id = p_recipe_id;

    -- C. INSERT
    INSERT INTO public.steps (recipe_id, step_number, description)
    SELECT 
        p_recipe_id,
        (x->>'step_number')::smallint,
        x->>'description'
    FROM jsonb_array_elements(p_steps) x
    WHERE x->>'id' IS NULL;

END;
$$;


ALTER FUNCTION "public"."update_recipe_details"("p_recipe_id" "uuid", "p_recipe_data" "jsonb", "p_ingredients" "jsonb", "p_steps" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
                                                                                                                                    BEGIN
                                                                                                                                       NEW.updated_at = now(); 
                                                                                                                                          RETURN NEW;
                                                                                                                                          END;
                                                                                                                                          $$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ingredients" (
    "id" bigint NOT NULL,
    "recipe_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "quantity" numeric NOT NULL,
    "unit" "text",
    "order" smallint,
    "recipe_status" "public"."recipe_status" DEFAULT 'draft'::"public"."recipe_status",
    "recipe_author_id" "uuid"
);


ALTER TABLE "public"."ingredients" OWNER TO "postgres";


ALTER TABLE "public"."ingredients" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."ingredients_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "username" "text",
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "username_length" CHECK (("char_length"("username") >= 3))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ratings" (
    "id" bigint NOT NULL,
    "recipe_id" "uuid" NOT NULL,
    "rating" smallint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    CONSTRAINT "ratings_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."ratings" OWNER TO "postgres";


ALTER TABLE "public"."ratings" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."ratings_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."steps" (
    "id" bigint NOT NULL,
    "recipe_id" "uuid" NOT NULL,
    "step_number" smallint NOT NULL,
    "description" "text" NOT NULL,
    "recipe_status" "public"."recipe_status" DEFAULT 'draft'::"public"."recipe_status",
    "recipe_author_id" "uuid"
);


ALTER TABLE "public"."steps" OWNER TO "postgres";


ALTER TABLE "public"."steps" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."steps_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."ingredients"
    ADD CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ratings"
    ADD CONSTRAINT "one_rating_per_user" UNIQUE ("recipe_id", "user_id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."ratings"
    ADD CONSTRAINT "ratings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."recipes"
    ADD CONSTRAINT "recipes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."steps"
    ADD CONSTRAINT "steps_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_ingredients_recipe_id" ON "public"."ingredients" USING "btree" ("recipe_id");



CREATE INDEX "idx_ratings_recipe_id" ON "public"."ratings" USING "btree" ("recipe_id");



CREATE INDEX "idx_ratings_user_id" ON "public"."ratings" USING "btree" ("user_id");



CREATE INDEX "idx_recipes_author_id" ON "public"."recipes" USING "btree" ("author_id");



CREATE INDEX "idx_recipes_difficulty_time" ON "public"."recipes" USING "btree" ("difficulty", "total_time_minutes") WHERE ("status" = 'published'::"public"."recipe_status");



CREATE INDEX "idx_recipes_status_created" ON "public"."recipes" USING "btree" ("status", "created_at" DESC);



CREATE INDEX "idx_recipes_type_time" ON "public"."recipes" USING "btree" ("type", "total_time_minutes") WHERE ("status" = 'published'::"public"."recipe_status");



CREATE INDEX "idx_recipes_vegan_published" ON "public"."recipes" USING "btree" ("id") WHERE (("status" = 'published'::"public"."recipe_status") AND ("is_vegan" = true));



CREATE INDEX "idx_recipes_vegetarian_published" ON "public"."recipes" USING "btree" ("id") WHERE (("status" = 'published'::"public"."recipe_status") AND ("is_vegetarian" = true));



CREATE INDEX "idx_steps_recipe_id" ON "public"."steps" USING "btree" ("recipe_id");



CREATE INDEX "ingredients_name_trgm_idx" ON "public"."ingredients" USING "gin" ("name" "extensions"."gin_trgm_ops");



CREATE INDEX "recipes_created_at_idx" ON "public"."recipes" USING "btree" ("created_at");



CREATE INDEX "recipes_embedding_published_idx" ON "public"."recipes" USING "hnsw" ("embedding" "extensions"."vector_cosine_ops") WHERE ("status" = 'published'::"public"."recipe_status");



CREATE INDEX "recipes_title_description_trgm_idx" ON "public"."recipes" USING "gin" (((("title" || ' '::"text") || COALESCE("description", ''::"text"))) "extensions"."gin_trgm_ops");



CREATE OR REPLACE TRIGGER "maintain_recipe_rating_cache" AFTER INSERT OR DELETE OR UPDATE ON "public"."ratings" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_rating_incremental"();



CREATE OR REPLACE TRIGGER "populate_ingredient_metadata" BEFORE INSERT ON "public"."ingredients" FOR EACH ROW EXECUTE FUNCTION "public"."populate_metadata_on_insert"();



CREATE OR REPLACE TRIGGER "populate_step_metadata" BEFORE INSERT ON "public"."steps" FOR EACH ROW EXECUTE FUNCTION "public"."populate_metadata_on_insert"();



CREATE OR REPLACE TRIGGER "protect_ingredient_metadata" BEFORE UPDATE ON "public"."ingredients" FOR EACH ROW EXECUTE FUNCTION "public"."force_child_metadata_sync"();



CREATE OR REPLACE TRIGGER "protect_step_metadata" BEFORE UPDATE ON "public"."steps" FOR EACH ROW EXECUTE FUNCTION "public"."force_child_metadata_sync"();



CREATE OR REPLACE TRIGGER "set_total_time_trigger" BEFORE INSERT OR UPDATE ON "public"."recipes" FOR EACH ROW EXECUTE FUNCTION "public"."calculate_total_time"();



CREATE OR REPLACE TRIGGER "sync_metadata_trigger" AFTER UPDATE ON "public"."recipes" FOR EACH ROW EXECUTE FUNCTION "public"."sync_recipe_metadata_to_children"();



CREATE OR REPLACE TRIGGER "update_recipes_updated_at" BEFORE UPDATE ON "public"."recipes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."ingredients"
    ADD CONSTRAINT "ingredients_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ratings"
    ADD CONSTRAINT "ratings_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ratings"
    ADD CONSTRAINT "ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."recipes"
    ADD CONSTRAINT "recipes_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."steps"
    ADD CONSTRAINT "steps_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE CASCADE;



CREATE POLICY "Les notes sont visibles par tous." ON "public"."ratings" FOR SELECT USING (true);



CREATE POLICY "Les profils publics sont visibles par tous." ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Les recettes publiées sont visibles par tous." ON "public"."recipes" FOR SELECT USING (("status" = 'published'::"public"."recipe_status"));



CREATE POLICY "Les utilisateurs ne peuvent modifier que leurs propres recettes" ON "public"."recipes" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "author_id"));



CREATE POLICY "Les utilisateurs ne peuvent supprimer que leurs propres recette" ON "public"."recipes" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "author_id"));



CREATE POLICY "Les utilisateurs peuvent créer des recettes." ON "public"."recipes" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "author_id"));



CREATE POLICY "Les utilisateurs peuvent insérer leur propre profil." ON "public"."profiles" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil." ON "public"."profiles" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Les utilisateurs peuvent voir leurs propres brouillons." ON "public"."recipes" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "author_id"));



CREATE POLICY "Optimized: Manage Ingredients" ON "public"."ingredients" USING (("auth"."uid"() = "recipe_author_id"));



CREATE POLICY "Optimized: Manage Steps" ON "public"."steps" USING (("auth"."uid"() = "recipe_author_id"));



CREATE POLICY "Optimized: Read Ingredients" ON "public"."ingredients" FOR SELECT USING ((("recipe_status" = 'published'::"public"."recipe_status") OR ("auth"."uid"() = "recipe_author_id")));



CREATE POLICY "Optimized: Read Steps" ON "public"."steps" FOR SELECT USING ((("recipe_status" = 'published'::"public"."recipe_status") OR ("auth"."uid"() = "recipe_author_id")));



CREATE POLICY "Users can manage their own ratings" ON "public"."ratings" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Users can rate recipes" ON "public"."ratings" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



ALTER TABLE "public"."ingredients" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ratings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."recipes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."steps" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
















































































































































































































































































































































































































































































































































































































































GRANT ALL ON FUNCTION "public"."calculate_total_time"() TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_total_time"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_total_time"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_recipe_with_relations"("p_author_id" "uuid", "p_recipe_data" "jsonb", "p_ingredients" "jsonb", "p_steps" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."create_recipe_with_relations"("p_author_id" "uuid", "p_recipe_data" "jsonb", "p_ingredients" "jsonb", "p_steps" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_recipe_with_relations"("p_author_id" "uuid", "p_recipe_data" "jsonb", "p_ingredients" "jsonb", "p_steps" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."force_child_metadata_sync"() TO "anon";
GRANT ALL ON FUNCTION "public"."force_child_metadata_sync"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."force_child_metadata_sync"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_rating_incremental"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_rating_incremental"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_rating_incremental"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON TABLE "public"."recipes" TO "service_role";
GRANT SELECT ON TABLE "public"."recipes" TO "anon";
GRANT ALL ON TABLE "public"."recipes" TO "authenticated";






GRANT ALL ON FUNCTION "public"."populate_metadata_on_insert"() TO "anon";
GRANT ALL ON FUNCTION "public"."populate_metadata_on_insert"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."populate_metadata_on_insert"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_recipe_metadata_to_children"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_recipe_metadata_to_children"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_recipe_metadata_to_children"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_recipe_details"("p_recipe_id" "uuid", "p_recipe_data" "jsonb", "p_ingredients" "jsonb", "p_steps" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_recipe_details"("p_recipe_id" "uuid", "p_recipe_data" "jsonb", "p_ingredients" "jsonb", "p_steps" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";




































GRANT SELECT,REFERENCES,TRIGGER,MAINTAIN ON TABLE "public"."ingredients" TO "anon";
GRANT ALL ON TABLE "public"."ingredients" TO "authenticated";
GRANT ALL ON TABLE "public"."ingredients" TO "service_role";



GRANT ALL ON SEQUENCE "public"."ingredients_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."ingredients_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."ingredients_id_seq" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,MAINTAIN ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,MAINTAIN ON TABLE "public"."ratings" TO "anon";
GRANT ALL ON TABLE "public"."ratings" TO "authenticated";
GRANT ALL ON TABLE "public"."ratings" TO "service_role";



GRANT ALL ON SEQUENCE "public"."ratings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."ratings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."ratings_id_seq" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,MAINTAIN ON TABLE "public"."steps" TO "anon";
GRANT ALL ON TABLE "public"."steps" TO "authenticated";
GRANT ALL ON TABLE "public"."steps" TO "service_role";



GRANT ALL ON SEQUENCE "public"."steps_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."steps_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."steps_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































