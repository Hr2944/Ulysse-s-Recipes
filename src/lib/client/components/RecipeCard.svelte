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

<a
	class="flex h-full flex-col overflow-hidden rounded-2xl border border-primary/10 bg-surface shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
	href="recipe/{recipe.id}"
	in:fade={{ duration: 250 }}
>
	<div class="h-48 w-full flex items-center justify-center">
		{#if recipe.cover_image_url}
			<img
				alt={`Image de la recette : ${recipe.title}`}
				class="h-full w-full object-cover"
				src={recipe.cover_image_url}
			/>
		{:else}
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="w-24 h-24 fill-on-surface/70">
				<path
					d="M360-400h80v-200h-80v200Zm-160-60q-46-23-73-66.5T100-621q0-75 51.5-127T278-800q12 0 24.5 2t24.5 5q25-41 65-64t88-23q48 0 88 23t65 64q12-3 24-5t25-2q75 0 126.5 52T860-621q0 51-27 94.5T760-460v220H200v-220Zm320 60h80v-200h-80v200Zm-240 80h400v-189l44-22q26-13 41-36.5t15-52.5q0-42-28.5-71T682-720q-11 0-20 2t-19 5l-47 13-31-52q-14-23-36.5-35.5T480-800q-26 0-48.5 12.5T395-752l-31 52-48-13q-10-2-19.5-4.5T277-720q-41 0-69 29t-28 71q0 29 15 52.5t41 36.5l44 22v189Zm-80 80h80v80h400v-80h80v160H200v-160Zm280-80Z" />
			</svg>
		{/if}
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
