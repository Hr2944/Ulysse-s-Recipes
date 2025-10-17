import { type Actions, fail, redirect } from '@sveltejs/kit';
import { recipeSchema } from '$lib/server/recipe';

export const actions = {
	default: async ({ locals: { supabase, user }, request }) => {
		if (!user) {
			redirect(303, '/auth');
		}
		const userId = user.id;

		const formData = await request.formData();

		const coverImageFile = formData.get('cover_image') as File;

		if (!coverImageFile || coverImageFile.size <= 0) {
			return fail(400, { message: 'Veuillez fournir une image de présentation.' });
		}

		const isVegetarian = formData.get('is_vegetarian') === 'on';
		const isVegan = formData.get('is_vegan') === 'on';

		const rawIngredients = JSON.parse(formData.get('ingredients') as string);
		const rawSteps = JSON.parse(formData.get('steps') as string);

		const validation = recipeSchema.safeParse({
			title: formData.get('title'),
			description: formData.get('description'),
			prep_time_minutes: formData.get('prep_time_minutes'),
			cook_time_minutes: formData.get('cook_time_minutes'),
			servings: formData.get('servings'),
			difficulty: formData.get('difficulty'),
			cost: formData.get('cost'),
			type: formData.get('type'),
			status: formData.get('status'),
			is_vegetarian: isVegetarian,
			is_vegan: isVegan,
			ingredients: rawIngredients,
			steps: rawSteps
		});

		if (!validation.success) {
			return fail(400, {
				message: 'Il y a des erreurs dans le formulaire',
				errorsListMessages: validation.error.issues.map((e) => e.message)
			});
		}

		if (coverImageFile.size > 5 * 1024 * 1024) {
			return fail(400, { message: "L'image ne doit pas dépasser 5 Mo." });
		}

		const fileExt = coverImageFile.name.split('.').pop();
		const coverImagePath = `public/${user.id}/${crypto.randomUUID()}.${fileExt}`;

		const { error: uploadError } = await supabase.storage
			.from('recipe-images')
			.upload(coverImagePath, coverImageFile);

		if (uploadError) {
			return fail(500, { message: "Erreur lors de l'upload de l'image." });
		}

		const { data: embedding } = await supabase.functions.invoke('embed', {
			body: { input: validation.data.title }
		});

		const validatedData = {
			...validation.data,
			cover_image_url: coverImagePath,
			embedding: embedding.embedding
		};

		const { ingredients, steps, ...recipeData } = validatedData;

		const { error } = await supabase.rpc('create_recipe_with_relations', {
			p_author_id: userId,
			p_recipe_data: recipeData,
			p_ingredients: ingredients,
			p_steps: steps
		});

		if (error) {
			return fail(500, { message: 'La création a échoué.' });
		}

		redirect(303, '/user');
	}
} satisfies Actions;
