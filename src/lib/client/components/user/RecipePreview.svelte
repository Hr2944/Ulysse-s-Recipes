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
<div
	class="group flex h-full flex-col overflow-hidden rounded-3xl bg-surface shadow-lg shadow-primary/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10"
	in:fade={{ duration: 250 }}
>
	<a class="relative aspect-[4/3] w-full overflow-hidden" href={`/recipe/${recipe.id}`}>
		{#if recipe.cover_image_url}
			<img
				alt={`Image de la recette : ${recipe.title}`}
				class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
				src={recipe.cover_image_url}
			/>
		{:else}
			<div class="flex h-full w-full items-center justify-center bg-primary/5">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="h-20 w-20 fill-primary/20">
					<path
						d="M360-400h80v-200h-80v200Zm-160-60q-46-23-73-66.5T100-621q0-75 51.5-127T278-800q12 0 24.5 2t24.5 5q25-41 65-64t88-23q48 0 88 23t65 64q12-3 24-5t25-2q75 0 126.5 52T860-621q0 51-27 94.5T760-460v220H200v-220Zm320 60h80v-200h-80v200Zm-240 80h400v-189l44-22q26-13 41-36.5t15-52.5q0-42-28.5-71T682-720q-11 0-20 2t-19 5l-47 13-31-52q-14-23-36.5-35.5T480-800q-26 0-48.5 12.5T395-752l-31 52-48-13q-10-2-19.5-4.5T277-720q-41 0-69 29t-28 71q0 29 15 52.5t41 36.5l44 22v189Zm-80 80h80v80h400v-80h80v160H200v-160Zm280-80Z" />
				</svg>
			</div>
		{/if}

		<div class="absolute top-3 right-3">
			{#if recipe.status === 'published'}
				<span class="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-primary shadow-sm backdrop-blur-md border border-primary/10">
          Publiée
        </span>
			{:else}
				<span class="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-on-surface/60 shadow-sm backdrop-blur-md border border-primary/10">
          Brouillon
        </span>
			{/if}
		</div>
	</a>

	<div class="flex flex-grow flex-col mt-6">
		<a class="flex-grow mx-6" href={`/recipe/${recipe.id}`}>
			<h2 class="font-serif text-2xl font-bold text-on-surface transition-colors group-hover:text-primary line-clamp-2">
				{recipe.title}
			</h2>
		</a>

		<div
			class="mt-6 flex items-center border-t border-primary/10 text-sm font-medium text-on-surface/60">

			<a
				class="w-1/2 flex items-center justify-center gap-2 px-4 py-6 font-bold text-primary transition-colors hover:bg-primary/10 hover:text-primary-700"
				href={`/user/recipe/${recipe.id}/edit`}>
				<svg fill="currentColor" height="20" viewBox="0 -960 960 960" width="20" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
				</svg>
				<span>Modifier</span>
			</a>

			<form action="?/deleteRecipe" class="w-1/2" method="POST">
				<input name="recipeId" type="hidden" value={recipe.id} />
				<button
					class="flex w-full items-center justify-center gap-2 px-4 py-6 font-bold text-red-600 transition-colors hover:bg-red-500/10 hover:text-red-700"
					type="submit">
					<svg fill="currentColor" height="20" viewBox="0 -960 960 960" width="20" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
					</svg>
					<span>Supprimer</span>
				</button>
			</form>
		</div>
	</div>
</div>
