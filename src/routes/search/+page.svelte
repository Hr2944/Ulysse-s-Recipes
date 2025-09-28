<script lang="ts">
	import { goto } from '$app/navigation';
	import FilterControls from '$lib/client/components/FilterControls.svelte';
	import { page } from '$app/state';
	import type { FilterValues } from '$lib/client/components/filterControls.types';
	import type { PageProps } from './$types';
	import RecipeCard from '$lib/client/components/RecipeCard.svelte';

	let { data }: PageProps = $props();
	let { recipes } = $derived(data);

	let isFiltering = $state(false);

	const VALID_SORT_VALUES = ['relevance', 'newest', 'rating', 'time_asc'] as const;
	const VALID_TYPE_VALUES = ['all', 'entrée', 'plat', 'dessert', 'boisson'] as const;
	const VALID_DIFFICULTY_VALUES = ['all', 'facile', 'moyen', 'difficile'] as const;
	const VALID_TIME_VALUES = ['all', 'lt_30', '30_60', 'gt_60'] as const;
	const VALID_STATUS_VALUES = ['all', 'published', 'draft'] as const;

	let initialValues: FilterValues = $derived.by(() => {
		const params = page.url.searchParams;

		function getValidatedParam<T extends string>(
			paramName: string,
			allowedValues: readonly T[]
		): T | undefined {
			const value = params.get(paramName);
			if (value && (allowedValues as readonly string[]).includes(value)) {
				return value as T;
			}
			return undefined;
		}

		return {
			q: params.get('q') ?? undefined,
			sort: getValidatedParam('sort', VALID_SORT_VALUES),
			type: getValidatedParam('type', VALID_TYPE_VALUES),
			difficulty: getValidatedParam('difficulty', VALID_DIFFICULTY_VALUES),
			total_time: getValidatedParam('total_time', VALID_TIME_VALUES),
			status: getValidatedParam('status', VALID_STATUS_VALUES),
			is_vegetarian: params.get('is_vegetarian') === 'true',
			is_vegan: params.get('is_vegan') === 'true'
		};
	});

	async function applyFilters(filters: FilterValues) {
		isFiltering = true;
		const newParams = new URLSearchParams();

		for (const [key, value] of Object.entries(filters)) {
			if (value && value !== 'all') {
				newParams.set(key, String(value));
			}
		}

		await goto(`/search?${newParams.toString()}`, { keepFocus: true, noScroll: true });

		isFiltering = false;
	}

	async function resetFilters() {
		isFiltering = true;
		await goto('/search', { keepFocus: true, noScroll: true });
		isFiltering = false;
	}
</script>

<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<div
		class="mb-8 flex flex-col items-start justify-between gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-center">
		<div>
			<h1 class="font-serif text-3xl font-bold text-primary md:text-4xl">
				Résultats Pour : "{initialValues.q}"
			</h1>
		</div>
	</div>

	<div class="mb-8">
		<FilterControls
			context="public"
			{initialValues}
			{isFiltering}
			onFilter={applyFilters}
			onReset={resetFilters}
		/>
	</div>
	{#if recipes && recipes.length !== 0}

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each recipes as recipe (recipe.id)}
				<RecipeCard recipe={recipe}></RecipeCard>
			{/each}
		</div>
	{:else}
		<p class="text-lg font-bold mx-auto text-center">Aucune de vos recettes ne correspond à ces critères.</p>
	{/if}
</main>
