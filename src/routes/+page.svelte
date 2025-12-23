<script lang="ts">
  import { fly } from 'svelte/transition';
  import Hero from '$lib/client/hero/Hero.svelte';
  import RecipeCard from '$lib/client/recipe-card/RecipeCard.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<Hero />

<section class="max-w-7xl mx-auto px-4 pb-16 mt-16" id="latest-recipes">
  <h2 class="text-3xl md:text-5xl font-serif font-bold text-primary mb-8 md:mb-12 pl-2 border-l-4 border-secondary">
   Les dernières recettes
  </h2>

  {#if data.recipes?.length}
   <div class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
    {#each data.recipes as recipe, i (recipe.id)}
     <div class="h-full" in:fly={{ y: 20, duration: 400, delay: i * 100 }}>
      <RecipeCard {recipe} />
     </div>
    {/each}
   </div>
  {:else}
   <p class="text-center text-on-surface/60">Aucune recette à afficher pour le moment.</p>
  {/if}
</section>
