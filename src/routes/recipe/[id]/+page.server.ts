import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals: { supabase, user } }) => {
	const { id } = params;
	const { data: recipe, error: err } = await supabase
		.from('recipes')
		.select(
			'title, status, author_id, cover_image_url, cost, difficulty, prep_time_minutes, cook_time_minutes, is_vegetarian, is_vegan, description, servings, ingredients ( id, name, quantity, unit, order ), steps ( id, step_number, description )'
		)
		.eq('id', id)
		.single();

	if (!recipe) {
		if (err.code === 'PGRST116') {
			error(404, 'Recette non trouvée.');
		}
		error(500, 'Erreur lors de la récupération de la recette.');
	}

	// User trying to access a draft he doesn't own
	if (recipe.status === 'draft' && (!user || user.id !== recipe.author_id)) {
		error(401);
	}

	recipe.cover_image_url =
		recipe.cover_image_url === ''
			? ''
			: supabase.storage
					.from('recipe-images')
					.getPublicUrl(recipe.cover_image_url, { transform: { height: 600, width: 800 } }).data
					.publicUrl;

	return { recipe };
};
