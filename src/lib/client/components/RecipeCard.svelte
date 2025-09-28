<script lang="ts">
	import { fade } from 'svelte/transition';

	type Props = {
		recipe: {
			id: string;
			title: string;
			cover_image_url: string | null;
			status: 'published' | 'draft';
		};
	};

	const { recipe }: Props = $props();
</script>

<a href="recipe/{recipe.id}"
	class="flex h-full flex-col overflow-hidden rounded-2xl border border-primary/10 bg-surface shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
	in:fade={{ duration: 250 }}
>
	<div class="h-48 w-full">
		<img
			alt="Image de la recette : {recipe.title}"
			class="h-full w-full object-cover"
			src={recipe.cover_image_url}
		/>
	</div>

	<div class="flex flex-grow flex-col p-5">
		<div class="flex items-start justify-between gap-4">
			<h2 class="flex-grow font-serif text-xl font-bold text-on-surface">
				{recipe.title}
			</h2>

			{#if recipe.status === 'published'}
        <span class="flex-shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
          Publiée
        </span>
			{:else}
        <span class="flex-shrink-0 rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-800">
          Brouillon
        </span>
			{/if}
		</div>
	</div>

	<div class="flex border-t border-primary/10 p-4 text-primary transition-colors hover:bg-primary/10">
		<p class="text-center w-full font-bold">Voir la Recette</p>
	</div>
</a>
