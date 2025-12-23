<script lang="ts">
	import { veganBadge, veggieBadge } from '$lib/client/recipe-card/diet-badges';

	type Props = {
		recipe: {
			id: string;
			title: string;
			cover_image_url: string | null;
			difficulty: string;
			total_time_minutes: number;
			average_rating: number;
			is_vegetarian: boolean;
			is_vegan: boolean;
		}
	};

	let { recipe }: Props = $props();

	let dietBadge = $derived.by(() => {
		if (recipe.is_vegan) {
			return veganBadge;
		}
		if (recipe.is_vegetarian) {
			return veggieBadge;
		}
		return null;
	});
</script>

<a
	class="group flex h-full flex-col overflow-hidden rounded-3xl bg-surface shadow-lg shadow-primary/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10"
	href="/recipe/{recipe.id}"
>
	<div class="relative aspect-4/3 w-full overflow-hidden bg-primary/5">
		{#if recipe.cover_image_url}
			<img
				alt={recipe.title}
				loading="lazy"
				decoding="async"
				class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
				src={recipe.cover_image_url}
			/>
		{:else}
			<div class="flex h-full w-full items-center justify-center">
				<svg viewBox="0 -960 960 960" class="h-20 w-20 fill-primary/20">
					<path
						d="M360-400h80v-200h-80v200Zm-160-60q-46-23-73-66.5T100-621q0-75 51.5-127T278-800q12 0 24.5 2t24.5 5q25-41 65-64t88-23q48 0 88 23t65 64q12-3 24-5t25-2q75 0 126.5 52T860-621q0 51-27 94.5T760-460v220H200v-220Zm320 60h80v-200h-80v200Zm-240 80h400v-189l44-22q26-13 41-36.5t15-52.5q0-42-28.5-71T682-720q-11 0-20 2t-19 5l-47 13-31-52q-14-23-36.5-35.5T480-800q-26 0-48.5 12.5T395-752l-31 52-48-13q-10-2-19.5-4.5T277-720q-41 0-69 29t-28 71q0 29 15 52.5t41 36.5l44 22v189Zm-80 80h80v80h400v-80h80v160H200v-160Zm280-80Z" />
				</svg>
			</div>
		{/if}

		{#if dietBadge}
			<div class="absolute top-4 right-4">
				<div class="rounded-full bg-white/95 px-2 py-1 text-primary shadow-sm backdrop-blur-md border border-primary/10"
						 title={dietBadge.label}>
					<span class="sr-only">{dietBadge.label}</span>
					<svg viewBox="0 -960 960 960" class="h-5 w-5 fill-current">
						<path d={dietBadge.svgPath} />
					</svg>
				</div>
			</div>
		{/if}
	</div>

	<div class="flex grow flex-col p-6">
		<h2
			class="grow font-serif text-2xl font-bold text-on-surface transition-colors group-hover:text-primary line-clamp-2">
			{recipe.title}
		</h2>

		<div
			class="mt-6 flex items-center justify-between border-t border-primary/10 pt-4 text-sm font-medium text-on-surface/60">
			<div class="flex items-center gap-4">
				<div class="flex items-center gap-1.5" title="Temps total">
					<svg class="h-4 w-4 fill-current" viewBox="0 -960 960 960">
						<path
							d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z" />
					</svg>
					<span>{recipe.total_time_minutes} min</span>
				</div>
				<div class="flex items-center gap-1.5 capitalize" title="Difficulté">
					<svg class="w-4 h-4 fill-current" viewBox="0 -960 960 960">
						<path
							d="M360-400h80v-200h-80v200Zm-160-60q-46-23-73-66.5T100-621q0-75 51.5-127T278-800q12 0 24.5 2t24.5 5q25-41 65-64t88-23q48 0 88 23t65 64q12-3 24-5t25-2q75 0 126.5 52T860-621q0 51-27 94.5T760-460v220H200v-220Zm320 60h80v-200h-80v200Zm-240 80h400v-189l44-22q26-13 41-36.5t15-52.5q0-42-28.5-71T682-720q-11 0-20 2t-19 5l-47 13-31-52q-14-23-36.5-35.5T480-800q-26 0-48.5 12.5T395-752l-31 52-48-13q-10-2-19.5-4.5T277-720q-41 0-69 29t-28 71q0 29 15 52.5t41 36.5l44 22v189Zm-80 80h80v80h400v-80h80v160H200v-160Zm280-80Z" />
					</svg>
					<span>{recipe.difficulty}</span>
				</div>
			</div>

			{#if recipe.average_rating > 0}
				<div class="flex items-center gap-1 rounded-full bg-yellow-100/50 px-2 py-0.5 text-yellow-700 font-bold"
						 title="Note moyenne">
					<span>{recipe.average_rating.toFixed(1)}</span>
					<svg class="h-4 w-4 fill-current" viewBox="0 -960 960 960">
						<path
							d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z" />
					</svg>
				</div>
			{/if}
		</div>
	</div>
</a>
