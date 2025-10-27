import { type Actions, error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { draftRecipeSchema, recipeSchema } from '$lib/server/recipe';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const SCHEMA_MAP = {
	draft: draftRecipeSchema,
	published: recipeSchema
};

export const actions = {
	default: async ({ locals: { supabase, user }, params, request }) => {
		if (!user) {
			redirect(303, '/auth');
		}
		const userId = user.id;
		const recipeId = params.id;

		if (!recipeId) {
			return fail(404, { message: 'Recette non trouvée.' });
		}

		const formData = await request.formData();
		const status = formData.get('status');
		const coverImageFile = formData.get('cover_image');

		let rawIngredients;
		let rawSteps;
		try {
			const ingredientsString = (formData.get('ingredients') as string) || '[]';
			const stepsString = (formData.get('steps') as string) || '[]';
			rawIngredients = JSON.parse(ingredientsString);
			rawSteps = JSON.parse(stepsString);
		} catch (_) {
			return fail(400, {
				message: 'Format des ingrédients ou des étapes invalide.'
			});
		}

		const validationSchema = SCHEMA_MAP[status as keyof typeof SCHEMA_MAP];

		if (!validationSchema) {
			return fail(400, { message: 'Statut invalide.' });
		}

		const { data: existingRecipe, error: fetchError } = await supabase
			.from('recipes')
			.select('cover_image_url')
			.eq('id', recipeId)
			.eq('author_id', user.id)
			.single();

		if (fetchError) {
			return fail(404, { message: 'Recette non trouvée ou non modifiable.' });
		}
		const oldCoverImagePath = existingRecipe?.cover_image_url || '';

		if (!(coverImageFile instanceof File)) {
			return fail(400, { message: 'Veuillez fournir une image de présentation.' });
		}

		const hasNewFile = coverImageFile.size > 0;

		if (status === 'published' && !hasNewFile && !oldCoverImagePath) {
			return fail(400, {
				message: 'Veuillez fournir une image de présentation.'
			});
		}

		if (hasNewFile && coverImageFile.size > MAX_FILE_SIZE_BYTES) {
			return fail(400, {
				message: `L'image de présentation ne doit pas dépasser ${MAX_FILE_SIZE_MB} Mo.`
			});
		}

		const validation = validationSchema.safeParse({
			title: formData.get('title'),
			description: formData.get('description'),
			prep_time_minutes: formData.get('prep_time_minutes'),
			cook_time_minutes: formData.get('cook_time_minutes'),
			servings: formData.get('servings'),
			difficulty: formData.get('difficulty'),
			cost: formData.get('cost'),
			type: formData.get('type'),
			status: formData.get('status'),
			is_vegetarian: formData.get('is_vegetarian') === 'on',
			is_vegan: formData.get('is_vegan') === 'on',
			ingredients: rawIngredients,
			steps: rawSteps
		});

		if (!validation.success) {
			return fail(400, {
				message: 'Il y a des erreurs dans le formulaire',
				errorsListMessages: validation.error.issues.map((e) => e.message)
			});
		}

		// --- 7. Image Upload & Path Handling (Merged Logic) ---
		let finalCoverImagePath = oldCoverImagePath; // Default to the old image

		if (hasNewFile) {
			// User uploaded a new file, so we replace the old one

			// Robust extension check (from 'new' page)
			const lastDot = coverImageFile.name.lastIndexOf('.');
			const fileExt = lastDot > 0 ? coverImageFile.name.substring(lastDot + 1).toLowerCase() : null;

			if (!fileExt) {
				return fail(400, { message: "L'image de présentation n'a pas une extension valide." });
			}

			const newPath = `public/${user.id}/${crypto.randomUUID()}.${fileExt}`;

			const { error: uploadError } = await supabase.storage
				.from('recipe-images')
				.upload(newPath, coverImageFile);

			if (uploadError) {
				return fail(500, { message: "Erreur lors de l'upload de l'image de présentation." });
			}

			finalCoverImagePath = newPath; // Set the path to the new image

			// Delete the old image (preserved from 'edit' logic)
			if (oldCoverImagePath) {
				// Don't await, let it run in the background
				supabase.storage.from('recipe-images').remove([oldCoverImagePath]);
			}
		}

		// --- 8. Embedding (from 'new' page) ---
		const { data: embeddingData, error: embeddingError } = await supabase.functions.invoke(
			'embed',
			{
				body: { input: validation.data.title }
			}
		);

		// Robust error check (from 'new' page)
		if (embeddingError) {
			return fail(500, {
				message: "Erreur lors de l'enregistrement, veuillez réessayer."
			});
		}

		// --- 9. Database Update ---
		const validatedData = {
			...validation.data,
			cover_image_url: finalCoverImagePath, // Use the determined path
			embedding: embeddingData.embedding
		};

		const { ingredients, steps, ...recipeData } = validatedData;

		// Use the 'update' RPC (preserved from 'edit' logic)
		const { error: dbError } = await supabase.rpc('update_recipe_details', {
			p_recipe_id: recipeId,
			p_author_id: userId,
			p_recipe_data: recipeData,
			p_ingredients: ingredients ?? [],
			p_steps: steps ?? []
		});

		if (dbError) {
			return fail(500, { message: "Erreur lors de l'enregistrement, veuillez réessayer." });
		}

		redirect(303, '/user');
	}
} satisfies Actions;

// --- Load Function (No changes needed) ---
export const load: PageServerLoad = async ({ params, locals: { supabase, user } }) => {
	if (!user) {
		throw redirect(303, '/auth');
	}

	const { id } = params;
	const { data: recipe, error: err } = await supabase
		.from('recipes')
		.select(
			'*, ingredients ( id, name, quantity, unit, order ), steps ( id, step_number, description )'
		)
		.eq('id', id)
		.eq('author_id', user.id)
		.single();

	if (err) {
		if (err.code === 'PGRST116') {
			error(404, "Recette non trouvée ou vous n'avez pas les droits pour la modifier.");
		}
		error(500, 'Erreur lors de la récupération de la recette.');
	}

	recipe.cover_image_url =
		recipe.cover_image_url === ''
			? ''
			: supabase.storage.from('recipe-images').getPublicUrl(recipe.cover_image_url).data.publicUrl;

	return { recipe };
};
