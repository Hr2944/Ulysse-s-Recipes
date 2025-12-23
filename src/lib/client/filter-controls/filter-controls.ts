import { goto } from '$app/navigation';
import type { FilterValues } from '$lib/client/filter-controls/filterControls.types';

export const VALID_SORT = ['relevance', 'newest', 'rating', 'time_asc'];
export const VALID_TYPE = ['all', 'entrée', 'plat', 'dessert', 'boisson'];
export const VALID_DIFF = ['all', 'facile', 'moyen', 'difficile'];
export const VALID_TIME = ['all', 'lt_30', '30_60', 'gt_60'];
export const VALID_STATUS = ['all', 'published', 'draft'];

function getValidatedParam<T extends string>(
	params: URLSearchParams,
	key: string,
	allowed: readonly string[]
): T | undefined {
	const val = params.get(key);
	return val && allowed.includes(val) ? (val as T) : undefined;
}

export function parseFilterParams(params: URLSearchParams): FilterValues {
	return {
		q: params.get('q') ?? undefined,
		sort: getValidatedParam(params, 'sort', VALID_SORT),
		type: getValidatedParam(params, 'type', VALID_TYPE),
		difficulty: getValidatedParam(params, 'difficulty', VALID_DIFF),
		total_time: getValidatedParam(params, 'total_time', VALID_TIME),
		status: getValidatedParam(params, 'status', VALID_STATUS),
		is_vegetarian: params.get('is_vegetarian') === 'true',
		is_vegan: params.get('is_vegan') === 'true'
	};
}

/**
 * NEW: Centralized navigation logic.
 * Takes the filters, constructs the URL, and handles the goto call.
 */
export async function updateUrlWithFilters(
	basePath: string,
	filters: FilterValues,
	setLoading?: (state: boolean) => void
) {
	setLoading?.(true);

	const newParams = new URLSearchParams();

	for (const [key, value] of Object.entries(filters)) {
		// Only add param if it has a value and isn't the default 'all'
		if (value !== undefined && value !== null && value !== 'all' && value !== false) {
			newParams.set(key, String(value));
		}
	}

	await goto(`${basePath}?${newParams.toString()}`, { keepFocus: true, noScroll: true });
	setLoading?.(false);
}

export async function resetFilters(basePath: string, setLoading?: (state: boolean) => void) {
	setLoading?.(true);
	await goto(basePath, { keepFocus: true, noScroll: true });
	setLoading?.(false);
}
