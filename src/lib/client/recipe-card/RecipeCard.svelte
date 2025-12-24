<script lang="ts">
	import { veganBadge, veggieBadge } from '$lib/client/recipe-card/diet-badges';
	import { chef_hat, star, timer } from '$lib/assets/svg-paths';

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
						d={chef_hat} />
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
							d={timer} />
					</svg>
					<span>{recipe.total_time_minutes} min</span>
				</div>
				<div class="flex items-center gap-1.5 capitalize" title="Difficulté">
					<svg class="w-4 h-4 fill-current" viewBox="0 -960 960 960">
						<path
							d={chef_hat} />
					</svg>
					<span>{recipe.difficulty}</span>
				</div>
			</div>

			<div class="flex items-center gap-1 rounded-full bg-yellow-100/50 px-2 py-0.5 text-yellow-700 font-bold"
					 title="Note moyenne">
				<span>{recipe.average_rating.toFixed(1)}</span>
				<svg class="h-4 w-4 fill-current" viewBox="0 -960 960 960">
					<path
						d={star} />
				</svg>
			</div>
		</div>
	</div>
</a>
