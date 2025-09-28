export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ingredients: {
        Row: {
          id: number
          name: string
          order: number | null
          quantity: number
          recipe_id: string
          unit: string | null
        }
        Insert: {
          id?: number
          name: string
          order?: number | null
          quantity: number
          recipe_id: string
          unit?: string | null
        }
        Update: {
          id?: number
          name?: string
          order?: number | null
          quantity?: number
          recipe_id?: string
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          created_at: string
          id: number
          rating: number
          recipe_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          rating: number
          recipe_id: string
        }
        Update: {
          created_at?: string
          id?: number
          rating?: number
          recipe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          author_id: string
          average_rating: number
          cook_time_minutes: number
          cost: Database["public"]["Enums"]["recipe_cost"]
          cover_image_url: string
          created_at: string
          description: string | null
          difficulty: Database["public"]["Enums"]["recipe_difficulty"]
          embedding: string | null
          id: string
          is_vegan: boolean
          is_vegetarian: boolean
          prep_time_minutes: number
          servings: number
          status: Database["public"]["Enums"]["recipe_status"]
          title: string
          total_time_minutes: number | null
          type: Database["public"]["Enums"]["recipe_type"]
          updated_at: string
        }
        Insert: {
          author_id: string
          average_rating?: number
          cook_time_minutes: number
          cost: Database["public"]["Enums"]["recipe_cost"]
          cover_image_url: string
          created_at?: string
          description?: string | null
          difficulty: Database["public"]["Enums"]["recipe_difficulty"]
          embedding?: string | null
          id?: string
          is_vegan?: boolean
          is_vegetarian?: boolean
          prep_time_minutes: number
          servings?: number
          status?: Database["public"]["Enums"]["recipe_status"]
          title: string
          total_time_minutes?: number | null
          type: Database["public"]["Enums"]["recipe_type"]
          updated_at?: string
        }
        Update: {
          author_id?: string
          average_rating?: number
          cook_time_minutes?: number
          cost?: Database["public"]["Enums"]["recipe_cost"]
          cover_image_url?: string
          created_at?: string
          description?: string | null
          difficulty?: Database["public"]["Enums"]["recipe_difficulty"]
          embedding?: string | null
          id?: string
          is_vegan?: boolean
          is_vegetarian?: boolean
          prep_time_minutes?: number
          servings?: number
          status?: Database["public"]["Enums"]["recipe_status"]
          title?: string
          total_time_minutes?: number | null
          type?: Database["public"]["Enums"]["recipe_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      steps: {
        Row: {
          description: string
          id: number
          recipe_id: string
          step_number: number
        }
        Insert: {
          description: string
          id?: number
          recipe_id: string
          step_number: number
        }
        Update: {
          description?: string
          id?: number
          recipe_id?: string
          step_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "steps_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_recipe_with_relations: {
        Args: {
          p_author_id: string
          p_ingredients: Json
          p_recipe_data: Json
          p_steps: Json
        }
        Returns: string
      }
      match_recipes: {
        Args: {
          match_count: number
          match_threshold: number
          query_embedding: string
        }
        Returns: {
          author_id: string
          average_rating: number
          cook_time_minutes: number
          cost: Database["public"]["Enums"]["recipe_cost"]
          cover_image_url: string
          created_at: string
          description: string | null
          difficulty: Database["public"]["Enums"]["recipe_difficulty"]
          embedding: string | null
          id: string
          is_vegan: boolean
          is_vegetarian: boolean
          prep_time_minutes: number
          servings: number
          status: Database["public"]["Enums"]["recipe_status"]
          title: string
          total_time_minutes: number | null
          type: Database["public"]["Enums"]["recipe_type"]
          updated_at: string
        }[]
      }
      update_recipe_details: {
        Args: {
          p_author_id: string
          p_ingredients: Json
          p_recipe_data: Json
          p_recipe_id: string
          p_steps: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      recipe_cost: "bon marché" | "moyen" | "cher"
      recipe_difficulty: "facile" | "moyen" | "difficile"
      recipe_status: "draft" | "published"
      recipe_type: "entrée" | "plat" | "dessert" | "boisson" | "accompagnement"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      recipe_cost: ["bon marché", "moyen", "cher"],
      recipe_difficulty: ["facile", "moyen", "difficile"],
      recipe_status: ["draft", "published"],
      recipe_type: ["entrée", "plat", "dessert", "boisson", "accompagnement"],
    },
  },
} as const
