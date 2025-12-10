<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import Checkbox from '$lib/client/components/input/Checkbox.svelte';

	const { data } = $props<{ data: PageData }>();
	const { recipe } = $derived(data);

	let isIngredientsSheetOpen = $state(false);
	let servings = $state(
		parseInt(page.url.searchParams.get('pour') ?? '') || recipe.servings
	);
	const baseServings = recipe.servings;

	let checkedSteps = $state(new Set<number>());

	const dynamicIngredients = $derived(
		recipe.ingredients.map((ing) => ({
			...ing,
			quantity: (ing.quantity / baseServings) * servings
		}))
	);

	const sortedSteps = $derived(
		[...recipe.steps].sort((a, b) => a.step_number - b.step_number)
	);
	const sortedIngredients = $derived(
		[...dynamicIngredients].sort(
			(a, b) => cleanIngredientName(b.name).length - cleanIngredientName(a.name).length
		)
	);

	function updateServings(newServings: number) {
		if (newServings > 0) servings = newServings;
	}

	function formatQuantity(qty: number): string {
		if (qty === null || qty === undefined) return '';
		const roundedQty = Math.round(qty * 100) / 100;
		if (roundedQty === 0.5) return '½';
		if (roundedQty === 0.25) return '¼';
		if (roundedQty === 0.75) return '¾';
		return String(roundedQty);
	}

	function cleanIngredientName(name: string): string {
		const aposChars = '[\u0027\u2019]';

		const elisions = [`d${aposChars}`, `l${aposChars}`];
		const elisionRegex = new RegExp(`^(${elisions.join('|')})`, 'i');
		let cleaned = name.replace(elisionRegex, '');

		const words = [
			'de la', 'de', 'du', 'des',
			'le', 'la', 'les', 'un', 'une',
			'aux', 'au', 'à la', 'à'
		];
		const wordRegex = new RegExp(`^(${words.join('|')})[\\s\\u00A0]+`, 'i');

		return cleaned.replace(wordRegex, '').trim();
	}

	function createFuzzyRegex(ingredientName: string): RegExp {
		const cleanedName = cleanIngredientName(ingredientName);

		if (!cleanedName.trim()) return /(?!)/;

		const words = cleanedName.split(/[\s\u00A0]+/);

		const regexParts = words.map(word => {
			let root = word;
			if (word.length > 2) {
				root = word.replace(/[eéèêë]*[sx]*$/i, '');
			}

			let pattern = '';
			for (const char of root) {
				pattern += getCharRegex(char);
			}

			if (word.length > 2) {
				pattern += '(?:[eéèêë]*(?:s|x)?)?';
			} else {
				pattern += '(?:s|x)?';
			}
			return pattern;
		});

		const corePattern = regexParts.join('[\\s\\u00A0]+');

		const aposChars = '\\u0027\\u2019';
		const aposClass = `[${aposChars}]`;

		const elisions = [`d${aposClass}`, `l${aposClass}`];
		const elisionGroup = `(?:${elisions.join('|')})?`;

		const prefixes = [
			'de[\\s\\u00A0]+la', 'de', 'du', 'des',
			'le', 'la', 'les', 'un', 'une',
			'aux', 'au', 'à[\\s\\u00A0]+la', 'à'
		];
		const wordGroup = `(?:(?:${prefixes.join('|')})[\\s\\u00A0]+)?`;

		const fullPrefix = `${wordGroup}${elisionGroup}`;

		const boundary = `(^|[\\s\\u00A0${aposChars}"(\\[>,:;!?.\\-])`;

		return new RegExp(`${boundary}(${fullPrefix})(${corePattern})(?![\\w\u00C0-\u00FF])`, 'gi');
	}

	function renderStepText(description: string): string {
		let renderedText = description;

		if (!sortedIngredients || sortedIngredients.length === 0) {
			return description;
		}

		for (const ingredient of sortedIngredients) {
			try {
				const regex = createFuzzyRegex(ingredient.name);

				// UPDATED CALLBACK SIGNATURE:
				// match: The full string matched
				// separator ($1): Space, bracket, etc.
				// prefix ($2): "le ", "l'", "d'"
				// coreText ($3): "vin blanc", "ail"
				renderedText = renderedText.replace(regex, (match, separator, prefix, coreText) => {

					if (match.includes('text-primary')) return match;

					const safeSeparator = separator || '';
					const safePrefix = prefix || ''; // Ensure it's not undefined

					const formattedQty = formatQuantity(ingredient.quantity);
					const unit = ingredient.unit ? ` ${ingredient.unit}` : '';

					// RECONSTRUCTION:
					// Separator + Prefix + <Bold>Ingredient + Quantity</Bold>
					return `${safeSeparator}${safePrefix}<span class="font-bold text-primary">${coreText} (${formattedQty}${unit})</span>`;
				});
			} catch (e) {
				console.warn(`Could not create regex for ${ingredient.name}`, e);
			}
		}

		return renderedText;
	}

	function getCharRegex(char: string): string {
		const accents: Record<string, string> = {
			'a': '[aàâä]', 'e': '[eéèêë]', 'i': '[iîï]', 'o': '[oôö]', 'u': '[uùûü]',
			'c': '[cç]', 'n': '[nñ]'
		};
		return accents[char.toLowerCase()] || char;
	}

	function toggleStep(stepNumber: number) {
		if (checkedSteps.has(stepNumber)) {
			checkedSteps.delete(stepNumber);
		} else {
			checkedSteps.add(stepNumber);
		}
		checkedSteps = new Set(checkedSteps);
	}
</script>

<svelte:head>
	<title>{recipe.title} - Ulysse's Recipes</title>
</svelte:head>

<div class="relative min-h-screen bg-surface">
	<header class="w-full bg-primary/10 overflow-hidden {recipe.cover_image_url ? 'h-[40vh] md:h-[60vh]' : 'hidden'}">
		{#if recipe.cover_image_url}
			<img src={recipe.cover_image_url} alt={recipe.title} class="h-full w-full object-cover" />
		{/if}
	</header>

	<main class="relative z-10 -mt-16 rounded-t-3xl bg-surface p-6">
		<!--				Rating Section-->
		<section class="text-center">
			<h1 class="font-serif text-4xl font-bold text-primary md:text-5xl">{recipe.title}</h1>
			<!--					<div class="mt-2 flex items-center justify-center gap-1 text-yellow-500">-->
			<!--						<span>{recipe.average_rating.toFixed(1)}</span>-->
			<!--						<svg class="h-8 w-8 fill-current" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">-->
			<!--							<path-->
			<!--								d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z" />-->
			<!--						</svg>-->
			<!--					</div>-->
		</section>

		<section class="mt-8 grid grid-cols-2 gap-4 rounded-2xl bg-primary/5 p-4 text-center md:grid-cols-4">
			<div class="flex flex-col items-center">
				<svg class="w-8 h-8 fill-primary" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M360-400h80v-200h-80v200Zm-160-60q-46-23-73-66.5T100-621q0-75 51.5-127T278-800q12 0 24.5 2t24.5 5q25-41 65-64t88-23q48 0 88 23t65 64q12-3 24-5t25-2q75 0 126.5 52T860-621q0 51-27 94.5T760-460v220H200v-220Zm320 60h80v-200h-80v200Zm-240 80h400v-189l44-22q26-13 41-36.5t15-52.5q0-42-28.5-71T682-720q-11 0-20 2t-19 5l-47 13-31-52q-14-23-36.5-35.5T480-800q-26 0-48.5 12.5T395-752l-31 52-48-13q-10-2-19.5-4.5T277-720q-41 0-69 29t-28 71q0 29 15 52.5t41 36.5l44 22v189Zm-80 80h80v80h400v-80h80v160H200v-160Zm280-80Z" />
				</svg>
				<span class="mt-1 font-bold capitalize text-primary">{recipe.difficulty}</span>
			</div>
			<div class="flex flex-col items-center">
				<svg class="h-8 w-8 fill-primary" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M600-120q-118 0-210-67T260-360H120v-80h122q-2-11-2-20v-40q0-9 2-20H120v-80h140q38-106 130-173t210-67q69 0 130.5 24T840-748l-70 70q-35-29-78.5-45.5T600-740q-75 0-136.5 38.5T370-600h230v80H344q-2 11-3 20t-1 20q0 11 1 20t3 20h256v80H370q32 63 93.5 101.5T600-220q48 0 92.5-16.5T770-282l70 70q-48 44-109.5 68T600-120Z" />
				</svg>
				<span class="mt-1 font-bold capitalize text-primary">{recipe.cost}</span>
			</div>
			<div class="flex flex-col items-center">
				<svg class="h-8 w-8 fill-primary" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z" />
				</svg>
				<span class="mt-1 font-bold text-primary">Préparation: {recipe.prep_time_minutes} min</span>
			</div>
			<div class="flex flex-col items-center">
				<svg class="h-8 w-8 fill-primary" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M640-680q17 0 28.5-11.5T680-720q0-17-11.5-28.5T640-760q-17 0-28.5 11.5T600-720q0 17 11.5 28.5T640-680Zm-160 0q17 0 28.5-11.5T520-720q0-17-11.5-28.5T480-760q-17 0-28.5 11.5T440-720q0 17 11.5 28.5T480-680Zm-160 0q17 0 28.5-11.5T360-720q0-17-11.5-28.5T320-760q-17 0-28.5 11.5T280-720q0 17 11.5 28.5T320-680ZM200-560v360h560v-360H200Zm200 160h160v-80H400v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm280-440Zm0 0Z" />
				</svg>
				<span class="mt-1 font-bold text-primary">Cuisson: {recipe.cook_time_minutes} min</span>
			</div>
			{#if recipe.is_vegetarian}
				<div class="flex flex-col items-center">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="h-8 w-8 fill-primary">
						<path
							d="M480-160q-56 0-105.5-17.5T284-227l-56 55q-11 11-28 11t-28-11q-11-11-11-28t11-28l55-55q-32-41-49.5-91T160-480q0-134 93-227t227-93h320v320q0 134-93 227t-227 93Zm0-80q100 0 170-70t70-170v-240H480q-100 0-170 70t-70 170q0 39 12 74.5t33 64.5l207-207q11-11 28-11t28 11q12 12 12 28.5T548-491L341-284q29 21 64.5 32.5T480-240Zm0-240Z" />
					</svg>
					<span class="mt-1 font-bold text-primary">Végétarien</span>
				</div>
			{/if}
			{#if recipe.is_vegan}
				<div class="flex flex-col items-center">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="h-8 w-8 fill-primary">
						<path
							d="M380-80q-75 0-127.5-52.5T200-260q0-35 17-64.5t63-75.5q6-6 11.5-12.5T306-430q-51-78-78.5-163.5T200-760q0-58 21-89t59-31q57 0 102 55t68 101q9 20 16.5 40.5T480-641q6-22 13.5-42.5T511-724q22-46 67-101t102-55q38 0 59 31t21 89q0 81-27.5 166.5T654-430q9 11 14.5 17.5T680-400q46 46 63 75.5t17 64.5q0 75-52.5 127.5T580-80q-45 0-72.5-10L480-100l-27.5 10Q425-80 380-80Zm0-80q23 0 46-5.5t43-16.5q-11-5-20-17t-9-21q0-8 11.5-14t28.5-6q17 0 28.5 6t11.5 14q0 9-9 21t-20 17q20 11 43 16.5t46 5.5q42 0 71-29t29-71q0-18-10-35t-30-34q-14-12-23-21t-29-34q-29-35-48-45.5T480-440q-41 0-60.5 10.5T372-384q-20 25-29 34t-23 21q-20 17-30 34t-10 35q0 42 29 71t71 29Zm40-130q-8 0-14-9t-6-21q0-12 6-21t14-9q8 0 14 9t6 21q0 12-6 21t-14 9Zm120 0q-8 0-14-9t-6-21q0-12 6-21t14-9q8 0 14 9t6 21q0 12-6 21t-14 9ZM363-489q11-8 25-14t31-11q-2-48-14.5-95.5T373-696q-19-40-42-67.5T285-799q-2 6-3.5 15.5T280-760q0 68 21.5 138T363-489Zm234 0q40-63 61.5-133T680-760q0-14-1.5-23.5T675-799q-23 8-46 35.5T587-696q-18 39-30.5 86.5T541-514q15 4 29 10.5t27 14.5Z" />
					</svg>
					<span class="mt-1 font-bold text-primary">Végan</span>
				</div>
			{/if}
		</section>

		{#if recipe.description}
			<section class="mt-8 prose max-w-none">
				<h2 class="mb-6 font-serif text-3xl font-bold text-primary">Description</h2>
				<p class="text-lg">{@html recipe.description}</p>
			</section>
		{/if}

		<!-- Steps -->
		<section class="mt-12">
			<h2 class="mb-8 font-serif text-3xl font-bold text-primary">Préparation</h2>
			<ol class="relative border-l-2 border-primary/10 ml-3 md:ml-4 space-y-8">
				{#each sortedSteps as step (step.id)}
					<li
						class="relative pl-8 md:pl-12 duration-500"
					>
						<span
							class="absolute -left-[0.55rem] top-6 h-4 w-4 rounded-full ring-4 ring-white transition-colors duration-300 {checkedSteps.has(step.step_number) ? 'bg-primary' : 'bg-gray-200'}"
						></span>
						<div
							class:opacity-60={checkedSteps.has(step.step_number)}
							class="flex flex-col gap-3 rounded-3xl p-6 bg-white shadow-sm shadow-primary/5 border border-primary/5 hover:shadow-md transition-all duration-300">
							<div class="flex items-center justify-between border-b border-primary/5 pb-3">
								<span class="font-bold text-primary uppercase tracking-wider text-xs">Étape {step.step_number}</span>
								<Checkbox onchange={() => toggleStep(step.step_number)} label="Terminée"></Checkbox>
							</div>
							<p
								class="text-lg text-on-surface/90 leading-relaxed"
								class:line-through={checkedSteps.has(step.step_number)}
							>
								{@html renderStepText(step.description)}
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
			class="shadow-ingredient-sheet fixed inset-x-0 bottom-0 z-50 max-h-[50vh] overflow-y-scroll rounded-t-3xl bg-surface"
		>
			<div class="flex h-full flex-col px-6">
				<div class="sticky top-0 pt-6 bg-surface">
					<div class="flex items-center justify-between pb-4">
						<h2 class="font-serif text-3xl font-bold text-primary">Ingrédients</h2>
						<button onclick={() => (isIngredientsSheetOpen = false)}
										class="text-on-surface/80 hover:bg-on-surface/20 rounded-full p-1 transition-colors"
										aria-label="Fermer la fenêtre des ingrédients">
							<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32"
									 fill="currentColor">
								<path
									d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
							</svg>
						</button>
					</div>
				</div>
				<div
					class="flex items-center justify-center gap-4 rounded-full bg-white border border-primary/10 p-1.5 shadow-sm mx-auto w-10/12 max-w-xs">
					<button onclick={() => updateServings(servings - 1)}
									class="rounded-full bg-primary/5 p-3 text-primary hover:bg-primary hover:text-white transition-colors transition-300 disabled:opacity-50"
									aria-label="Retirer un couvert" disabled={servings <= 1}>
						<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"
								 fill="currentColor">
							<path d="M200-440v-80h560v80H200Z" />
						</svg>
					</button>
					<div class="flex flex-col items-center w-24">
						<span class="text-xl font-bold text-primary leading-none">{servings}</span>
						<span class="text-[10px] uppercase tracking-wider text-primary/60 font-bold">Personnes</span>
					</div>
					<button onclick={() => updateServings(servings + 1)}
									class="rounded-full bg-primary/5 p-3 text-primary hover:bg-primary hover:text-white transition-colors transition-300"
									aria-label="Ajouter un couvert">
						<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"
								 fill="currentColor">
							<path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
						</svg>
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

	<div
		class="fixed z-20 inset-x-0 bottom-16 sm:bottom-0 p-4 flex items-center justify-center md:justify-end pointer-events-none transition-all duration-300">
		<button
			class="pointer-events-auto flex w-full max-w-lg items-center justify-center gap-2 rounded-full bg-primary px-16 py-4 font-bold text-on-primary shadow-lg transition-transform hover:scale-105 active:scale-100"
			onclick={() => (isIngredientsSheetOpen = true)}
		>
			<svg class="w-6 h-6 fill-current" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M640-80q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170T640-80Zm0-80q66 0 113-47t47-113q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47Zm-480 0q-33 0-56.5-23.5T80-240v-304q0-8 1.5-16t4.5-16l80-184h-6q-17 0-28.5-11.5T120-800v-40q0-17 11.5-28.5T160-880h280q17 0 28.5 11.5T480-840v40q0 17-11.5 28.5T440-760h-6l66 152q-19 10-36 21t-32 25l-84-198h-96l-92 216v304h170q5 21 13.5 41.5T364-160H160Zm480-440q-42 0-71-29t-29-71q0-42 29-71t71-29v200q0-42 29-71t71-29q42 0 71 29t29 71H640Z" />
			</svg>
			Ingrédients
		</button>
	</div>
</div>

<style>
    .shadow-ingredient-sheet {
        box-shadow: 0 -20px 50px -10px rgb(0 0 0 / 0.25);
    }
</style>
