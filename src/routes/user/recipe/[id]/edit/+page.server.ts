import { type Actions, error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { recipeSchema } from '$lib/server/recipe';

export const actions = {
	default: async ({ locals: { supabase, user }, params, request }) => {
		if (!user) {
			redirect(303, '/auth');
		}
		const userId = user.id;
		const recipeId = params.id;

		if (!recipeId) {
			return fail(404, 'Recette non trouvée.');
		}

		const formData = await request.formData();

		const coverImageFile = formData.get('cover_image') as File;

		if (!coverImageFile) {
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
			console.log(validation.error);
			return fail(400, { message: 'Il y a des erreurs dans le formulaire.' });
		}

		let coverImagePath: string;

		// User modified the image
		if (coverImageFile && coverImageFile.size > 0) {
			console.log(coverImageFile);
			if (coverImageFile.size > 5 * 1024 * 1024) {
				return fail(400, { message: "L'image ne doit pas dépasser 5 Mo." });
			}

			const fileExt = coverImageFile.name.split('.').pop();
			const newPath = `public/${user.id}/${crypto.randomUUID()}.${fileExt}`;

			const { error: uploadError } = await supabase.storage
				.from('recipe-images')
				.upload(newPath, coverImageFile);

			if (uploadError) {
				console.log(uploadError);
				return fail(500, { message: "Erreur lors de l'upload de l'image." });
			}

			const { data: old_cover_image_url } = await supabase
				.from('recipes')
				.select('cover_image_url')
				.eq('id', recipeId)
				.eq('author_id', user.id)
				.single();

			if (old_cover_image_url) {
				await supabase.storage.from('recipe-images').remove([old_cover_image_url.cover_image_url]);
			}

			coverImagePath = newPath;
		} else {
			// User didn't modify the image
			const { data: old_cover_image_url } = await supabase
				.from('recipes')
				.select('cover_image_url')
				.eq('id', recipeId)
				.eq('author_id', user.id)
				.single();

			if (!old_cover_image_url) {
				return fail(400, { message: 'Une image de présentation doit être fournie.' });
			}

			coverImagePath = old_cover_image_url.cover_image_url;
		}

		if (!coverImagePath) {
			return fail(400, { message: "Erreur avec l'image de présentation." });
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

		const { error } = await supabase.rpc('update_recipe_details', {
			p_recipe_id: recipeId,
			p_author_id: userId,
			p_recipe_data: recipeData,
			p_ingredients: ingredients,
			p_steps: steps
		});

		if (error) {
			return fail(500, { message: 'La mise à jour a échoué.' });
		}

		redirect(303, '/user');
	}
} satisfies Actions;

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

	recipe.cover_image_url = supabase.storage
		.from('recipe-images')
		.getPublicUrl(recipe.cover_image_url).data.publicUrl;

	return { recipe };
};
