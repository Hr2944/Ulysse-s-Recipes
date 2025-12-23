<script lang="ts">
  import { page } from '$app/state';
  import FilterControls from '$lib/client/filter-controls/FilterControls.svelte';
  import RecipeCard from '$lib/client/recipe-card/RecipeCard.svelte';
  import type { PageProps } from './$types';
  import { parseFilterParams, resetFilters, updateUrlWithFilters } from '$lib/client/filter-controls/filter-controls';

  let { data }: PageProps = $props();
  let recipes = $derived(data.recipes);

  let isFiltering = $state(false);
  let initialValues = $derived(parseFilterParams(page.url.searchParams));

  const onApply = (filters: any) =>
    updateUrlWithFilters('/search', filters, (s) => isFiltering = s);

  const onReset = () =>
    resetFilters('/search', (s) => isFiltering = s);
</script>

<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
  {#if initialValues.q}
   <header class="mb-8 border-b border-black/10 pb-6">
    <h1 class="font-serif text-3xl font-bold text-primary md:text-4xl">
     Résultats Pour : "{initialValues.q}"
    </h1>
   </header>
  {/if}

  <div class="mb-8">
   <FilterControls
    context="public"
    {initialValues}
    {isFiltering}
    onFilter={onApply}
    onReset={onReset}
   />
  </div>

  {#if recipes?.length}
   <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {#each recipes as recipe (recipe.id)}
     <RecipeCard {recipe} />
    {/each}
   </div>
  {:else}
   <div class="flex flex-col items-center justify-center py-16 text-center">
    <h2 class="text-on-surface/60 mb-12 font-bold text-9xl">¯\_(ツ)_/¯</h2>
    <h3 class="text-xl font-bold text-primary">Aucune recette trouvée</h3>
    <p class="text-on-surface/60 mt-2 max-w-md">
     Essayez de modifier vos filtres ou votre recherche pour trouver ce que vous cherchez.
    </p>
    <button onclick={onReset} class="mt-6 text-primary font-bold hover:underline">
     Réinitialiser les filtres
    </button>
   </div>
  {/if}
</main>
