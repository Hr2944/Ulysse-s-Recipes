import { type Actions, error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { FilterValues } from '$lib/client/filter-controls/filterControls.types';
import { searchWithFilters } from '$lib/server/search';

export const actions = {
	logout: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut();
		redirect(303, '/');
	},

	deleteRecipe: async ({ request, locals: { supabase, user } }) => {
		const formData = await request.formData();
		const recipeId = formData.get('recipeId');

		if (!user) {
			redirect(303, '/auth');
		}

		if (!recipeId) {
			return fail(500);
		}

		const { data } = await supabase
			.from('recipes')
			.delete()
			.eq('id', recipeId as string)
			.eq('author_id', user.id)
			.select('cover_image_url')
			.single();

		if (data && data.cover_image_url) {
			await supabase.storage.from('recipe-images').remove([data.cover_image_url]);
		}
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ url, locals: { supabase, user } }) => {
	if (!user) {
		redirect(303, '/auth');
	}

	const filters: FilterValues = {
		q: url.searchParams.get('q') ?? undefined,
		sort: (url.searchParams.get('sort') as FilterValues['sort']) ?? 'newest',
		type: (url.searchParams.get('type') as FilterValues['type']) ?? 'all',
		difficulty: (url.searchParams.get('difficulty') as FilterValues['difficulty']) ?? 'all',
		status: (url.searchParams.get('status') as FilterValues['status']) ?? 'all',
		total_time: (url.searchParams.get('total_time') as FilterValues['total_time']) ?? 'all',
		is_vegetarian: url.searchParams.get('is_vegetarian') === 'true',
		is_vegan: url.searchParams.get('is_vegan') === 'true'
	};

	const queryResult = await searchWithFilters(supabase, filters, 'id, title, cover_image_url, status', user.id);

	if (queryResult.error) {
		error(500, 'Erreur lors du chargement des recettes, veuillez recharger la page.');
	}

	const { data: profile } = await supabase
		.from('profiles')
		.select('username')
		.eq('id', user.id)
		.single();

	return { recipes: queryResult.recipes, username: profile?.username };
};
