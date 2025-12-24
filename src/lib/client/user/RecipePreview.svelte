<script lang="ts">
 import { bin, chef_hat, pen } from '$lib/assets/svg-paths';

  type Recipe = {
   id: string;
   title: string;
   cover_image_url: string | null;
   status: 'published' | 'draft';
  };

  let { recipe }: { recipe: Recipe } = $props();

  const STATUS_CONFIG = {
   published: { label: 'Publiée', style: 'text-primary' },
   draft: { label: 'Brouillon', style: 'text-on-surface/60' }
  } as const;
</script>

<div class="group flex h-full flex-col overflow-hidden rounded-3xl bg-surface shadow-lg shadow-primary/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">

  <a class="relative aspect-4/3 w-full overflow-hidden bg-primary/5" href={`/recipe/${recipe.id}`}>
   {#if recipe.cover_image_url}
    <img
     alt={recipe.title}
     class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
     loading="lazy"
     decoding="async"
     src={recipe.cover_image_url}
    />
   {:else}
    <div class="flex h-full w-full items-center justify-center">
     <svg viewBox="0 -960 960 960" class="h-20 w-20 fill-primary/20">
      <path d={chef_hat} />
     </svg>
    </div>
   {/if}

   <div class="absolute right-3 top-3">
    <span class="rounded-full bg-white/95 px-3 py-1 text-xs font-bold shadow-sm backdrop-blur-md border border-primary/10 {STATUS_CONFIG[recipe.status].style}">
      {STATUS_CONFIG[recipe.status].label}
    </span>
   </div>
  </a>

  <div class="mt-6 flex grow flex-col">
   <a class="mx-6 grow" href={`/recipe/${recipe.id}`}>
    <h2 class="line-clamp-2 font-serif text-2xl font-bold text-on-surface transition-colors group-hover:text-primary">
     {recipe.title}
    </h2>
   </a>

   <div class="mt-6 flex items-center border-t border-primary/10 text-sm font-medium text-on-surface/60">

    <a
     class="flex w-1/2 items-center justify-center gap-2 border-r border-primary/10 px-4 py-6 font-bold text-primary transition-colors hover:bg-primary/10 hover:text-primary-700"
     href={`/user/recipe/${recipe.id}/edit`}>
     <svg fill="currentColor" height="20" viewBox="0 -960 960 960" width="20">
      <path d={pen} />
     </svg>
     <span>Modifier</span>
    </a>

    <form action="?/deleteRecipe" class="w-1/2" method="POST">
     <input name="recipeId" type="hidden" value={recipe.id} />
     <button
      class="flex w-full items-center justify-center gap-2 px-4 py-6 font-bold text-red-600 transition-colors hover:bg-red-500/10 hover:text-red-700"
      type="submit">
      <svg fill="currentColor" height="20" viewBox="0 -960 960 960" width="20">
       <path d={bin} />
      </svg>
      <span>Supprimer</span>
     </button>
    </form>
   </div>
  </div>
</div>
