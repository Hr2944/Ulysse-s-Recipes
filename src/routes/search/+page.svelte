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
	{#if initialValues.q}
		<div
			class="mb-8 flex flex-col items-start justify-between gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-center">
			<div>
				<h1 class="font-serif text-3xl font-bold text-primary md:text-4xl">
					Résultats Pour : "{initialValues.q}"
				</h1>
			</div>
		</div>
	{/if}

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
		<div class="flex flex-col items-center justify-center py-16 text-center">
			<svg class="h-24 w-24 fill-primary/20 mb-4" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q128-15 214-101t86-229q-53 53-116.5 82.5T526-404q-30 0-58-2t-54-7q-10 66-53 118.5T260-226q48 29 103.5 46T480-166Zm0 86q-139-15-248.5-94.5T90-366q-7-23-10.5-46t-3.5-48q0-123 82-218.5T366-799q21-3 41.5-13.5T452-846l28-54 28 54q11 21 31.5 31.5T594-804q22 3 43.5 10t41.5 21q19 14 30.5 34t14.5 43q3 23 10 45t19 43q12 22 28.5 40.5T818-538q25 30 38.5 68t13.5 78q0 85-44.5 158T696-122q-32 16-66 27t-70 15h-80Z" />
			</svg>
			<h3 class="text-xl font-bold text-primary">Aucune recette trouvée</h3>
			<p class="text-on-surface/60 mt-2 max-w-md">Essayez de modifier vos filtres ou votre recherche pour trouver ce que
				vous cherchez.</p>
			<button onclick={resetFilters} class="mt-6 text-primary font-bold hover:underline">
				Réinitialiser les filtres
			</button>
		</div>
	{/if}
</main>
