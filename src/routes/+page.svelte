<script lang="ts">
	import RecipeCard from '$lib/client/components/RecipeCard.svelte';
	import Hero from '$lib/client/components/Hero.svelte';
	import type { PageData } from './$types';
	import { fly } from 'svelte/transition';

	let { data }: { data: PageData } = $props();
</script>

<Hero />

<section class="max-w-7xl mx-auto px-4 pb-16">
	<h2 class="text-3xl font-serif font-bold text-primary mb-8 md:mb-12 pl-2 border-l-4 border-secondary">
		Les dernières recettes
	</h2>

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
