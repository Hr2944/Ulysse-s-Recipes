<script lang="ts">
	import { fade } from 'svelte/transition';

	type Props = {
		recipe: {
			id: string;
			title: string;
			cover_image_url: string | null;
			status: 'published' | 'draft';
			difficulty: string;
			total_time_minutes: number;
			average_rating: number;
			is_vegetarian: boolean;
			is_vegan: boolean;
		};
	};

	const { recipe }: Props = $props();
</script>

<a
	class="group flex h-full flex-col overflow-hidden rounded-3xl border border-primary/10 bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
	href="/recipe/{recipe.id}"
	in:fade={{ duration: 250 }}
>
	<div class="relative aspect-video w-full overflow-hidden">
		{#if recipe.cover_image_url}
			<img
				alt={`Image de la recette : ${recipe.title}`}
				class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
				src={recipe.cover_image_url}
			/>
		{:else}
			<div class="flex h-full w-full items-center justify-center bg-primary/5">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="h-16 w-16 fill-primary/20">
					<path
						d="M360-400h80v-200h-80v200Zm-160-60q-46-23-73-66.5T100-621q0-75 51.5-127T278-800q12 0 24.5 2t24.5 5q25-41 65-64t88-23q48 0 88 23t65 64q12-3 24-5t25-2q75 0 126.5 52T860-621q0 51-27 94.5T760-460v220H200v-220Zm320 60h80v-200h-80v200Zm-240 80h400v-189l44-22q26-13 41-36.5t15-52.5q0-42-28.5-71T682-720q-11 0-20 2t-19 5l-47 13-31-52q-14-23-36.5-35.5T480-800q-26 0-48.5 12.5T395-752l-31 52-48-13q-10-2-19.5-4.5T277-720q-41 0-69 29t-28 71q0 29 15 52.5t41 36.5l44 22v189Zm-80 80h80v80h400v-80h80v160H200v-160Zm280-80Z" />
				</svg>
			</div>
		{/if}

		<!-- Badges overlay -->
		<div class="absolute top-3 right-3 flex gap-2">
			{#if recipe.is_vegan}
				<div class="rounded-full bg-white/90 p-1.5 text-green-700 shadow-sm backdrop-blur-sm" title="Végan">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="h-4 w-4 fill-current">
						<path
							d="M380-80q-75 0-127.5-52.5T200-260q0-35 17-64.5t63-75.5q6-6 11.5-12.5T306-430q-51-78-78.5-163.5T200-760q0-58 21-89t59-31q57 0 102 55t68 101q9 20 16.5 40.5T480-641q6-22 13.5-42.5T511-724q22-46 67-101t102-55q38 0 59 31t21 89q0 81-27.5 166.5T654-430q9 11 14.5 17.5T680-400q46 46 63 75.5t17 64.5q0 75-52.5 127.5T580-80q-45 0-72.5-10L480-100l-27.5 10Q425-80 380-80Z" />
					</svg>
				</div>
			{:else if recipe.is_vegetarian}
				<div class="rounded-full bg-white/90 p-1.5 text-green-700 shadow-sm backdrop-blur-sm" title="Végétarien">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="h-4 w-4 fill-current">
						<path
							d="M480-160q-56 0-105.5-17.5T284-227l-56 55q-11 11-28 11t-28-11q-11-11-11-28t11-28l55-55q-32-41-49.5-91T160-480q0-134 93-227t227-93h320v320q0 134-93 227t-227 93Zm0-80q100 0 170-70t70-170v-240H480q-100 0-170 70t-70 170q0 39 12 74.5t33 64.5l207-207q11-11 28-11t28 11q12 12 12 28.5T548-491L341-284q29 21 64.5 32.5T480-240Zm0-240Z" />
					</svg>
				</div>
			{/if}
		</div>
	</div>

	<div class="flex flex-grow flex-col p-5">
		<div class="flex-grow">
			<h2 class="font-serif text-xl font-bold text-on-surface transition-colors group-hover:text-primary">
				{recipe.title}
			</h2>
		</div>

		<div class="mt-4 flex items-center justify-between border-t border-primary/10 pt-4 text-sm text-on-surface/70">
			<div class="flex items-center gap-4">
				<div class="flex items-center gap-1" title="Temps total">
					<svg class="h-4 w-4 fill-current" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z" />
					</svg>
					<span>{recipe.total_time_minutes} min</span>
				</div>
				<div class="flex items-center gap-1 capitalize" title="Difficulté">
					<svg class="w-4 h-4 fill-current" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M360-400h80v-200h-80v200Zm-160-60q-46-23-73-66.5T100-621q0-75 51.5-127T278-800q12 0 24.5 2t24.5 5q25-41 65-64t88-23q48 0 88 23t65 64q12-3 24-5t25-2q75 0 126.5 52T860-621q0 51-27 94.5T760-460v220H200v-220Zm320 60h80v-200h-80v200Zm-240 80h400v-189l44-22q26-13 41-36.5t15-52.5q0-42-28.5-71T682-720q-11 0-20 2t-19 5l-47 13-31-52q-14-23-36.5-35.5T480-800q-26 0-48.5 12.5T395-752l-31 52-48-13q-10-2-19.5-4.5T277-720q-41 0-69 29t-28 71q0 29 15 52.5t41 36.5l44 22v189Zm-80 80h80v80h400v-80h80v160H200v-160Zm280-80Z" />
					</svg>
					<span>{recipe.difficulty}</span>
				</div>
			</div>

			{#if recipe.average_rating > 0}
				<div class="flex items-center gap-1 text-yellow-600 font-bold" title="Note moyenne">
					<span>{recipe.average_rating.toFixed(1)}</span>
					<svg class="h-4 w-4 fill-current" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
						<path
							d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z" />
					</svg>
				</div>
			{/if}
		</div>
	</div>
</a>
