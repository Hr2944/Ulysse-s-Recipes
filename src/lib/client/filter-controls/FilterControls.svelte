<script lang="ts">
	import type { FilterValues } from '$lib/client/filter-controls/filterControls.types';
	import Checkbox from '$lib/client/inputs/Checkbox.svelte';
	import TextInput from '$lib/client/inputs/TextInput.svelte';
	import Dropdown from '$lib/client/inputs/Dropdown.svelte';
	import { loading } from '$lib/assets/svg-paths';

	type Props = {
		initialValues?: FilterValues;
		context?: 'public' | 'user';
		isFiltering?: boolean;
		onFilter?: (values: FilterValues) => void;
		onReset?: () => void;
	};

	let {
		initialValues = {},
		context = 'public',
		isFiltering = false,
		onFilter = () => {
		},
		onReset = () => {
		}
	}: Props = $props();

	// 1. Constants defined once to handle defaults cleanly
	const DEFAULTS = {
		q: '',
		sort: 'relevance',
		type: 'all',
		difficulty: 'all',
		total_time: 'all',
		status: 'all',
		is_vegetarian: false,
		is_vegan: false
	};

	// 2. Consolidated state into a single reactive object
	let filters = $state({ ...DEFAULTS, ...initialValues });

	function handleFilter(e: SubmitEvent) {
		e.preventDefault();
		if (isFiltering) return;
		// No need to reconstruct object, just pass the state
		onFilter(filters);
	}

	function handleReset() {
		if (isFiltering) return;
		// Efficiently reset state to defaults
		Object.assign(filters, DEFAULTS);
		onReset();
	}
</script>

<form aria-busy={isFiltering} onsubmit={handleFilter}>
	<fieldset
		class="rounded-3xl border border-primary/5 bg-white p-6 shadow-xl shadow-primary/5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 md:p-10 disabled:opacity-70 disabled:cursor-wait"
		disabled={isFiltering}
	>

		<div class="mb-8">
			<TextInput bind:value={filters.q} label="Mots-clés (ex: tarte, chocolat...)" name="q" type="search" />
		</div>

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			<Dropdown bind:value={filters.sort} label="Trier par">
				<option value="relevance">Pertinence</option>
				<option value="newest">Les plus récents</option>
				<option value="rating">Les mieux notés</option>
				<option value="time_asc">Temps total croissant</option>
			</Dropdown>

			<Dropdown bind:value={filters.type} label="Type de recette">
				<option value="all">Tous types</option>
				<option value="entrée">Entrée</option>
				<option value="plat">Plat</option>
				<option value="dessert">Dessert</option>
				<option value="boisson">Boisson</option>
			</Dropdown>

			<Dropdown bind:value={filters.difficulty} label="Difficulté">
				<option value="all">Toutes difficultés</option>
				<option value="facile">Facile</option>
				<option value="moyen">Moyen</option>
				<option value="difficile">Difficile</option>
			</Dropdown>

			<Dropdown bind:value={filters.total_time} label="Temps total">
				<option value="all">Indifférent</option>
				<option value="lt_30">Moins de 30 min</option>
				<option value="30_60">30 à 60 min</option>
				<option value="gt_60">Plus de 60 min</option>
			</Dropdown>

			{#if context === 'user'}
				<Dropdown bind:value={filters.status} label="Statut">
					<option value="all">Tous</option>
					<option value="published">Publiée</option>
					<option value="draft">Brouillon</option>
				</Dropdown>
			{/if}
		</div>

		<div class="mt-8 flex flex-col items-center justify-between gap-6 md:flex-row">
			<div class="flex w-full flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl bg-primary/5 px-6 py-4 md:w-auto">
				<span class="text-sm font-bold uppercase tracking-wide text-primary">Régimes</span>
				<div class="hidden h-4 w-px bg-primary/20 sm:block"></div>
				<Checkbox bind:checked={filters.is_vegetarian} label="Végétarien" />
				<Checkbox bind:checked={filters.is_vegan} label="Végan" />
			</div>

			<div class="flex w-full flex-wrap items-center justify-center gap-4 md:w-auto">
				<button
					class="flex min-w-40 flex-1 items-center justify-center rounded-full bg-primary px-8 py-3.5 font-bold text-on-primary shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 md:flex-none"
					type="submit">
					{#if isFiltering}
						<svg class="mr-2 h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							{@html loading}
						</svg>
						<span>...</span>
					{:else}
						<span>Rechercher</span>
					{/if}
				</button>

				<button
					class="justify-center rounded-full px-6 py-3.5 font-bold text-primary transition-colors hover:bg-primary/10"
					onclick={handleReset}
					type="button">
					Réinitialiser
				</button>
			</div>
		</div>

	</fieldset>
</form>
