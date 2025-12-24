<script lang="ts">
  import { slide } from 'svelte/transition';
  import { page } from '$app/state';
  import type { PageData } from './$types';
  import Checkbox from '$lib/client/inputs/Checkbox.svelte';
  import { formatQuantity, renderStepText } from '$lib/client/utils/recipe-text';
  import {
   chef_hat,
   euro_symbol,
   ingredients,
   minus,
   oven,
   plus,
   timer,
   vegan_badge,
   veggie_badge
  } from '$lib/assets/svg-paths';

  let { data }: { data: PageData } = $props();
  // Simple derived access
  let recipe = $derived(data.recipe);

  let isIngredientsSheetOpen = $state(false);

  // Initialize from URL or default
  let servings = $derived(
   parseInt(page.url.searchParams.get('pour') ?? '') || recipe.servings
  );

  let checkedSteps = $state(new Set<number>());

  // Derived calculations
  const scalingFactor = $derived(servings / recipe.servings);

  const dynamicIngredients = $derived(
   recipe.ingredients.map((ing) => ({
    ...ing,
    quantity: ing.quantity * scalingFactor
   }))
  );

  const sortedSteps = $derived(
   [...recipe.steps].sort((a, b) => a.step_number - b.step_number)
  );

  // Sort ingredients by name length (longest first) to improve regex matching accuracy
  const sortedIngredients = $derived(
   [...dynamicIngredients].sort((a, b) => b.name.length - a.name.length)
  );

  function updateServings(val: number) {
   if (val > 0) servings = val;
  }

  function toggleStep(num: number) {
   const newSet = new Set(checkedSteps);
   if (newSet.has(num)) newSet.delete(num);
   else newSet.add(num);
   checkedSteps = newSet;
  }
</script>

<svelte:head>
  <title>{recipe.title} - Ulysse's Recipes</title>
</svelte:head>

<article class="relative min-h-screen bg-surface pb-20 sm:pb-0">

  <header class="w-full bg-primary/10 overflow-hidden {recipe.cover_image_url ? 'h-[40vh] md:h-[60vh]' : 'hidden'}">
   {#if recipe.cover_image_url}
    <img
        src={recipe.cover_image_url}
        alt={recipe.title}
        fetchpriority="high"
        loading="eager"
        class="h-full w-full object-cover"
    />
   {/if}
  </header>

  <main class="relative z-10 -mt-16 rounded-t-3xl bg-surface p-6">

   <div class="text-center">
    <h1 class="font-serif text-4xl font-bold text-primary md:text-5xl">{recipe.title}</h1>
   </div>

   <dl class="mt-8 grid grid-cols-2 gap-4 rounded-2xl bg-primary/5 p-4 text-center md:grid-cols-4 place-items-center">

    <div>
     <dt class="sr-only">Difficulté</dt>
     <dd class="flex flex-col items-center">
       <svg class="w-8 h-8 fill-primary" viewBox="0 -960 960 960">
        <path d={chef_hat} />
       </svg>
       <span class="mt-1 font-bold capitalize text-primary">{recipe.difficulty}</span>
     </dd>
    </div>

    <div>
     <dt class="sr-only">Coût</dt>
     <dd class="flex flex-col items-center">
       <svg class="h-8 w-8 fill-primary" viewBox="0 -960 960 960">
        <path d={euro_symbol} />
       </svg>
       <span class="mt-1 font-bold capitalize text-primary">{recipe.cost}</span>
     </dd>
    </div>

    <div>
     <dt class="sr-only">Temps de préparation</dt>
     <dd class="flex flex-col items-center">
       <svg class="h-8 w-8 fill-primary" viewBox="0 -960 960 960">
        <path d={timer} />
       </svg>
       <span class="mt-1 font-bold text-primary">{recipe.prep_time_minutes} min</span>
     </dd>
    </div>

    <div>
     <dt class="sr-only">Temps de cuisson</dt>
     <dd class="flex flex-col items-center">
       <svg class="h-8 w-8 fill-primary" viewBox="0 -960 960 960">
        <path d={oven} />
       </svg>
       <span class="mt-1 font-bold text-primary">{recipe.cook_time_minutes} min</span>
     </dd>
    </div>

    {#if recipe.is_vegetarian}
     <div>
      <dt class="sr-only">Régime</dt>
      <dd class="flex flex-col items-center">
        <svg viewBox="0 -960 960 960" class="h-8 w-8 fill-primary">
         <path d={veggie_badge} />
        </svg>
        <span class="mt-1 font-bold text-primary">Végétarien</span>
      </dd>
     </div>
    {/if}

    {#if recipe.is_vegan}
     <div>
      <dt class="sr-only">Régime</dt>
      <dd class="flex flex-col items-center">
        <svg viewBox="0 -960 960 960" class="h-8 w-8 fill-primary">
         <path d={vegan_badge} />
        </svg>
        <span class="mt-1 font-bold text-primary">Végan</span>
      </dd>
     </div>
    {/if}
   </dl>

   {#if recipe.description}
    <section class="mt-8 prose max-w-none">
     <h2 class="mb-6 font-serif text-3xl font-bold text-primary">Description</h2>
     <p class="text-lg">{@html recipe.description}</p>
    </section>
   {/if}

   <section class="mt-12">
    <h2 class="mb-8 font-serif text-3xl font-bold text-primary">Préparation</h2>
    <ol class="relative border-l-2 border-primary/10 ml-3 md:ml-4 space-y-8">
     {#each sortedSteps as step (step.id)}
      <li class="relative pl-8 md:pl-12 duration-500">
       <span class="absolute -left-[0.55rem] top-6 h-4 w-4 rounded-full ring-4 ring-white transition-colors duration-300 {checkedSteps.has(step.step_number) ? 'bg-primary' : 'bg-gray-200'}"></span>

       <div class="flex flex-col gap-3 rounded-3xl p-6 bg-white shadow-sm shadow-primary/5 border border-primary/5 hover:shadow-md transition-all duration-300 {checkedSteps.has(step.step_number) ? 'opacity-60' : ''}">
        <div class="flex items-center justify-between border-b border-primary/5 pb-3">
         <span class="font-bold text-primary uppercase tracking-wider text-xs">Étape {step.step_number}</span>
         <Checkbox onchange={() => toggleStep(step.step_number)} label="Terminée" />
        </div>
        <p class="text-lg text-on-surface/90 leading-relaxed {checkedSteps.has(step.step_number) ? 'line-through' : ''}">
         {@html renderStepText(step.description, sortedIngredients)}
        </p>
       </div>
      </li>
     {/each}
    </ol>
   </section>
  </main>

  {#if isIngredientsSheetOpen}
   <div
    transition:slide={{ duration: 300, axis: 'y' }}
    class="fixed inset-x-0 bottom-0 z-50 max-h-[50vh] overflow-y-scroll rounded-t-3xl bg-surface shadow-[0_-20px_50px_-10px_rgb(0,0,0,0.25)]"
   >
    <div class="flex h-full flex-col px-6">
     <div class="sticky top-0 pt-6 bg-surface z-10">
      <div class="flex items-center justify-between pb-4">
       <h2 class="font-serif text-3xl font-bold text-primary">Ingrédients</h2>
       <button aria-label="Fermer la liste des ingrédients" onclick={() => (isIngredientsSheetOpen = false)} class="text-on-surface/80 rotate-45 hover:bg-on-surface/20 rounded-full p-1 transition-colors">
        <svg height="32" viewBox="0 -960 960 960" width="32" fill="currentColor">
         <path d={plus} />
        </svg>
       </button>
      </div>
     </div>

     <div class="flex items-center justify-center gap-4 rounded-full bg-white border border-primary/10 p-1.5 shadow-sm mx-auto w-10/12 max-w-xs">
      <button aria-label="Enlever un couvert" onclick={() => updateServings(servings - 1)} disabled={servings <= 1} class="rounded-full bg-primary/5 p-3 text-primary hover:bg-primary hover:text-white transition-colors disabled:opacity-50">
       <svg height="20" viewBox="0 -960 960 960" width="20" fill="currentColor"><path d={minus} /></svg>
      </button>
      <div class="flex flex-col items-center w-24">
       <span class="text-xl font-bold text-primary leading-none">{servings}</span>
       <span class="text-[10px] uppercase tracking-wider text-primary/60 font-bold">Personnes</span>
      </div>
      <button aria-label="Ajouter un couvert" onclick={() => updateServings(servings + 1)} class="rounded-full bg-primary/5 p-3 text-primary hover:bg-primary hover:text-white transition-colors">
       <svg height="20" viewBox="0 -960 960 960" width="20" fill="currentColor"><path d={plus} /></svg>
      </button>
     </div>

     <ul class="flex-grow space-y-3 p-6">
      {#each sortedIngredients as ingredient (ingredient.id)}
       <li class="flex items-center justify-between p-4 rounded-2xl bg-surface border border-primary/5 shadow-sm">
        <span class="font-semibold text-on-surface">{ingredient.name}</span>
        <span class="font-bold text-primary bg-primary/5 px-3 py-1 rounded-full text-sm">
         {formatQuantity(ingredient.quantity)} {ingredient.unit ?? ''}
        </span>
       </li>
      {/each}
     </ul>
    </div>
   </div>
  {/if}

  <div class="fixed z-20 inset-x-0 bottom-4 sm:bottom-0 p-4 flex justify-center md:justify-end pointer-events-none">
   <button
    onclick={() => (isIngredientsSheetOpen = true)}
    class="pointer-events-auto flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 font-bold text-on-primary shadow-lg transition-transform hover:scale-105 active:scale-100"
   >
    <svg class="w-6 h-6 fill-current" viewBox="0 -960 960 960">
     <path d={ingredients} />
    </svg>
    Ingrédients
   </button>
  </div>
</article>
