<script lang="ts">
	import RecipeCard from '$lib/client/components/RecipeCard.svelte';
	import type { PageData } from './$types';
	import { fly } from 'svelte/transition';

	let { data }: { data: PageData } = $props();
</script>

<section>
	<h1 class="mt-6 text-3xl md:text-5xl font-bold text-center font-family-headings text-primary mb-8 md:mb-12">
		Les dernières recettes
	</h1>

	{#if data.recipes && data.recipes.length > 0}
		<div class="mx-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
			{#each data.recipes as recipe, i}
				<div in:fly={{ y: 20, duration: 400, delay: i * 100 }}>
					<RecipeCard {recipe} />
				</div>
			{/each}
		</div>
	{:else}
		<p class="text-center text-gray-500">Aucune recette à afficher pour le moment.</p>
	{/if}
</section>
