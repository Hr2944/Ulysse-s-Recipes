import type { FilterValues } from '$lib/client/filter-controls/filterControls.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/supabase.types';

async function _searchWithFilters(
	supabase: SupabaseClient<Database>,
	filters: FilterValues,
	restrictToUserId: string | null
) {
	let query;

	if (filters.q) {
		const { data: embedding } = await supabase.functions.invoke('embed', {
			body: { input: filters.q }
		});

		query = supabase.rpc('match_recipes', {
			query_embedding: embedding['embedding'],
			match_threshold: 0.78,
			match_count: 10
		});
	} else {
		query = supabase.from('recipes').select('*');
	}

	if (restrictToUserId) {
		query = query.eq('author_id', restrictToUserId);
	}

	if (filters.type && filters.type !== 'all') {
		query = query.eq('type', filters.type);
	}
	if (filters.difficulty && filters.difficulty !== 'all') {
		query = query.eq('difficulty', filters.difficulty);
	}
	if (filters.status && filters.status !== 'all') {
		query = query.eq('status', filters.status);
	}

	if (filters.is_vegetarian) {
		query = query.eq('is_vegetarian', true);
	}
	if (filters.is_vegan) {
		query = query.eq('is_vegan', true);
	}

	if (filters.total_time && filters.total_time !== 'all') {
		if (filters.total_time === 'lt_30') {
			query = query.lt('total_time_minutes', 30);
		} else if (filters.total_time === '30_60') {
			query = query.gte('total_time_minutes', 30).lte('total_time_minutes', 60);
		} else if (filters.total_time === 'gt_60') {
			query = query.gt('total_time_minutes', 60);
		}
	}

	switch (filters.sort) {
		case 'newest':
			query = query.order('created_at', { ascending: false });
			break;
		case 'rating':
			query = query.order('average_rating', { ascending: false });
			break;
		case 'time_asc':
			query = query.order('total_time_minutes', { ascending: true });
			break;
		case 'relevance':
			if (!filters.q) {
				query = query.order('created_at', { ascending: false });
			}
			break;
		default:
			query = query.order('created_at', { ascending: false });
			break;
	}

	let { data: recipes, error: dbError } = await query;

	if (dbError) {
		return { error: true, recipes: [] };
	}

	if (!recipes) {
		return { error: false, recipes: [] };
	}

	recipes = recipes.map((r) => {
		return {
			...r,
			cover_image_url:
				r.cover_image_url === ''
					? ''
					: supabase.storage.from('recipe-images').getPublicUrl(r.cover_image_url).data.publicUrl
		};
	});

	return {
		error: false,
		recipes: recipes
	};
}

export async function searchWithFilters(
	supabase: SupabaseClient<Database>,
	filters: FilterValues,
	restrictToUserId: string | null = null,
	retries = 3
) {
	for (let i = 1; i <= retries; i++) {
		const queryResult = await _searchWithFilters(supabase, filters, restrictToUserId);
		if (!queryResult.error) return queryResult;
	}

	return {
		error: true,
		recipes: null
	};
}
