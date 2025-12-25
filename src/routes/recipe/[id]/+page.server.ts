import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
	const { id } = params;
	const { data: recipe, error: err } = await supabase
		.from('recipes')
		.select(
			'title, cover_image_url, cost, difficulty, prep_time_minutes, cook_time_minutes, is_vegetarian, is_vegan, description, servings, ingredients ( id, name, quantity, unit, order ), steps ( id, step_number, description )'
		)
		.eq('id', id)
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
			: supabase.storage
					.from('recipe-images')
					.getPublicUrl(recipe.cover_image_url, { transform: { height: 600, width: 800 } }).data
					.publicUrl;

	return { recipe };
};
