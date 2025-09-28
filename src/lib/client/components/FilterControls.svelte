<script lang="ts">
	import type { FilterValues } from '$lib/client/components/filterControls.types';
	import Checkbox from '$lib/client/components/input/Checkbox.svelte';
	import TextInput from '$lib/client/components/input/TextInput.svelte';
	import Dropdown from '$lib/client/components/input/Dropdown.svelte';

	type Props = {
		initialValues?: FilterValues;
		context?: 'public' | 'user';
		isFiltering?: boolean;
		onFilter?: (values: FilterValues) => void;
		onReset?: () => void;
	};

	const {
		initialValues = {}, context = 'public', isFiltering = false,
		onFilter = () => {
		},
		onReset = () => {
		}
	}: Props = $props();

	let q = $state(initialValues.q ?? '');
	let sort = $state(initialValues.sort ?? 'relevance');
	let type = $state(initialValues.type ?? 'all');
	let difficulty = $state(initialValues.difficulty ?? 'all');
	let total_time = $state(initialValues.total_time ?? 'all');
	let status = $state(initialValues.status ?? 'all');
	let is_vegetarian = $state(initialValues.is_vegetarian ?? false);
	let is_vegan = $state(initialValues.is_vegan ?? false);


	function handleFilter(e: SubmitEvent) {
		e.preventDefault();
		if (isFiltering) return;
		onFilter({
			q, sort, type, difficulty, total_time, status,
			is_vegetarian, is_vegan
		});
	}

	function handleReset() {
		if (isFiltering) return;
		q = '';
		sort = 'relevance';
		type = 'all';
		difficulty = 'all';
		total_time = 'all';
		status = 'all';
		is_vegetarian = false;
		is_vegan = false;
		onReset();
	}
</script>

<form aria-busy={isFiltering} onsubmit={handleFilter}>
	<fieldset class="rounded-2xl border border-primary/10 bg-surface p-6" disabled={isFiltering}>

		<div class="w-full">
			<TextInput bind:value={q} label="Rechercher parmi les recettes..." name="q" type="search"></TextInput>
		</div>

		<div class="flex flex-wrap gap-x-6 gap-y-3 my-3">
			<div class="flex-10 basis-0 min-w-xs">
				<Dropdown bind:value={sort} label="Trier par">
					<option value="relevance">Pertinence</option>
					<option value="newest">Les plus récents</option>
					<option value="rating">Les mieux notés</option>
					<option value="time_asc">Temps total croissant</option>
				</Dropdown>
			</div>


			<div class="flex-10 basis-0 min-w-xs">
				<Dropdown bind:value={type} label="Type de recette">
					<option value="all">Tous types</option>
					<option value="entree">Entrée</option>
					<option value="plat">Plat</option>
					<option value="dessert">Dessert</option>
					<option value="boisson">Boisson</option>
				</Dropdown>
			</div>


			<div class="flex-10 basis-0 min-w-xs">
				<Dropdown bind:value={difficulty} label="Difficulté">
					<option value="all">Toutes difficultés</option>
					<option value="facile">Facile</option>
					<option value="moyen">Moyen</option>
					<option value="difficile">Difficile</option>
				</Dropdown>
			</div>

			<div class="flex-10 basis-0 min-w-xs">
				<Dropdown bind:value={total_time} label="Temps total">
					<option value="all">Indifférent</option>
					<option value="lt_30">Moins de 30 min</option>
					<option value="30_60">30 à 60 min</option>
					<option value="gt_60">Plus de 60 min</option>
				</Dropdown>
			</div>

			{#if context === 'user'}
				<div class="flex-10 basis-0">
					<Dropdown bind:value={status} label="Statut">
						<option value="all">Tous</option>
						<option value="published">Publiée</option>
						<option value="draft">Brouillon</option>
					</Dropdown>
				</div>
			{/if}
		</div>

		<fieldset class="mt-3">
			<legend class="mb-2 text-base font-medium text-on-surface">Régimes spécifiques</legend>
			<div class="flex flex-wrap items-center gap-x-6 gap-y-2">
				<Checkbox bind:checked={is_vegetarian} label="Végétarien"></Checkbox>
				<Checkbox bind:checked={is_vegan} label="Végan"></Checkbox>
			</div>
		</fieldset>

		<div class="flex items-center gap-4 mt-6">
			<button
				class="flex min-w-[200px] items-center justify-center rounded-full bg-primary px-6 py-3 font-bold text-on-primary shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 disabled:cursor-wait disabled:opacity-70"
				type="submit">
				{#if isFiltering}
					<svg class="mr-2 h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					<span>Filtrage...</span>
				{:else}
					<span>Appliquer les filtres</span>
				{/if}
			</button>
			<button
				class="rounded-full px-4 py-3 font-bold text-primary transition-colors hover:bg-primary/10 disabled:cursor-wait disabled:opacity-70"
				onclick={handleReset}
				type="button">
				Réinitialiser
			</button>
		</div>
	</fieldset>
</form>
