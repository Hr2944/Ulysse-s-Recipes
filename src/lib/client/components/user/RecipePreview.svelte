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

<article
	class="flex h-full flex-col overflow-hidden rounded-2xl border border-primary/10 bg-surface shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
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

	<div class="flex border-t border-primary/10">
		<a
			class="flex flex-1 items-center justify-center gap-2 rounded-bl-2xl p-4 font-bold text-primary transition-colors hover:bg-primary/10 active:scale-95"
			href={`/user/recipe/${recipe.id}/edit`}>
			<svg fill="currentColor" height="20" viewBox="0 -960 960 960" width="20" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
			</svg>
			<span>Modifier</span>
		</a>

		<form action="?/deleteRecipe" class="flex-1" method="POST">
			<input name="recipeId" type="hidden" value={recipe.id} />
			<button
				class="flex w-full items-center justify-center gap-2 rounded-br-2xl p-4 font-bold text-red-600 transition-colors hover:bg-red-500/10 active:scale-95"
				type="submit">
				<svg fill="currentColor" height="20" viewBox="0 -960 960 960" width="20" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
				</svg>
				<span>Supprimer</span>
			</button>
		</form>
	</div>
</article>
