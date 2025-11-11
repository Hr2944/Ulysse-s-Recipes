import { error } from '@sveltejs/kit';
import type { FilterValues } from '$lib/client/components/filterControls.types';
import { searchWithFilters } from '$lib/server/search';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
	const filters: FilterValues = {
		q: url.searchParams.get('q') ?? undefined,
		sort: (url.searchParams.get('sort') as FilterValues['sort']) ?? 'newest',
		type: (url.searchParams.get('type') as FilterValues['type']) ?? 'all',
		difficulty: (url.searchParams.get('difficulty') as FilterValues['difficulty']) ?? 'all',
		status: 'published',
		total_time: (url.searchParams.get('total_time') as FilterValues['total_time']) ?? 'all',
		is_vegetarian: url.searchParams.get('is_vegetarian') === 'true',
		is_vegan: url.searchParams.get('is_vegan') === 'true'
	};

	const queryResult = await searchWithFilters(supabase, filters);

	if (queryResult.error) {
		error(500, 'Erreur lors du chargement des recettes, veuillez recharger la page.');
	}

	return { recipes: queryResult.recipes };
};
