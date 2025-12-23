import { type Actions, fail, redirect } from '@sveltejs/kit';
import { draftRecipeSchema, recipeSchema } from '$lib/server/recipe';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const SCHEMA_MAP = {
	draft: draftRecipeSchema,
	published: recipeSchema
};

export const actions = {
	default: async ({ locals: { supabase, user }, request }) => {
		if (!user) {
			redirect(303, '/auth');
		}
		const userId = user.id;

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

		if (!(coverImageFile instanceof File)) {
			return fail(400, { message: 'Veuillez fournir un fichier image.' });
		}

		const hasFile = coverImageFile.size > 0;

		if (status === 'published' && !hasFile) {
			return fail(400, {
				message: 'Veuillez fournir une image de présentation.'
			});
		}

		if (hasFile && coverImageFile.size > MAX_FILE_SIZE_BYTES) {
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

		let coverImagePath = '';
		if (hasFile) {
			const lastDot = coverImageFile.name.lastIndexOf('.');
			const fileExt = lastDot > 0 ? coverImageFile.name.substring(lastDot + 1).toLowerCase() : null;

			if (!fileExt) {
				return fail(400, { message: "L'image de présentation n'a pas d'extension valide." });
			}

			coverImagePath = `public/${user.id}/${crypto.randomUUID()}.${fileExt}`;

			const { error: uploadError } = await supabase.storage
				.from('recipe-images')
				.upload(coverImagePath, coverImageFile);

			if (uploadError) {
				return fail(500, { message: "Erreur lors de l'upload de l'image." });
			}
		}

		const { data: embeddingData, error: embeddingError } = await supabase.functions.invoke(
			'embed',
			{
				body: { input: validation.data.title }
			}
		);

		if (embeddingError) {
			return fail(500, { message: "Erreur lors de l'enregistrement, veuillez réessayer." });
		}

		const validatedData = {
			...validation.data,
			cover_image_url: coverImagePath,
			embedding: embeddingData.embedding
		};

		const { ingredients, steps, ...recipeData } = validatedData;

		const { error: dbError } = await supabase.rpc('create_recipe_with_relations', {
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
