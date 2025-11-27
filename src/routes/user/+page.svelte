<script lang="ts">
	import { goto } from '$app/navigation';
	import FilterControls from '$lib/client/components/FilterControls.svelte';
	import { page } from '$app/state';
	import type { FilterValues } from '$lib/client/components/filterControls.types';
	import type { PageProps } from './$types';
	import RecipePreview from '$lib/client/components/user/RecipePreview.svelte';

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

		await goto(`/user?${newParams.toString()}`, { keepFocus: true, noScroll: true });
		isFiltering = false;
	}

	async function resetFilters() {
		isFiltering = true;
		await goto('/user', { keepFocus: true, noScroll: true });
		isFiltering = false;
	}
</script>

<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<div class="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
		<div>
			<h1 class="font-serif text-4xl font-bold text-primary md:text-5xl">
				Bonjour {data.username ?? ''}
			</h1>
			<p class="mt-2 text-lg text-on-surface/80">
				Gérez vos créations culinaires et votre profil.
			</p>
		</div>

		<form action="?/logout" method="POST">
			<button
				class="rounded-full border-2 border-primary px-6 py-2.5 font-bold text-primary transition-all hover:bg-primary hover:text-on-primary hover:shadow-lg active:scale-95"
			>
				Me déconnecter
			</button>
		</form>
	</div>

	<div class="mb-8 flex flex-col items-start justify-between gap-4 border-b border-primary/10 pb-6 sm:flex-row sm:items-end">
		<div>
			<h2 class="font-serif text-3xl font-bold text-primary">
				Mes Recettes
			</h2>
		</div>
		<a
			class="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-on-primary shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
			href="/user/recipe/new">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 fill-current" viewBox="0 -960 960 960">
				<path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
			</svg>
			Créer une recette
		</a>
	</div>

	<div class="mb-8">
		<FilterControls
			context="user"
			{initialValues}
			{isFiltering}
			onFilter={applyFilters}
			onReset={resetFilters}
		/>
	</div>

	{#if recipes && recipes.length !== 0}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each recipes as recipe (recipe.id)}
				<RecipePreview recipe={recipe}></RecipePreview>
			{/each}
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center py-16 text-center rounded-3xl bg-primary/5 border border-primary/10">
			<svg class="h-20 w-20 fill-primary/30 mb-4" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
				<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0 0v-560 560Z" />
			</svg>
			<p class="text-lg font-bold text-primary">Aucune recette trouvée</p>
			<p class="text-on-surface/60">Commencez par créer votre première recette !</p>
			<a href="/user/recipe/new" class="mt-4 text-sm font-bold text-primary underline hover:text-primary/80">
				Créer une recette maintenant
			</a>
		</div>
	{/if}

</main>
