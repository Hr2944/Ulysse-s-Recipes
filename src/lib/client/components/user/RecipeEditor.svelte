<script lang="ts">
	import { slide } from 'svelte/transition';
	import Checkbox from '$lib/client/components/input/Checkbox.svelte';
	import TextInput from '$lib/client/components/input/TextInput.svelte';
	import Dropdown from '$lib/client/components/input/Dropdown.svelte';
	import TextArea from '$lib/client/components/input/TextArea.svelte';
	import ImageUploader from '$lib/client/components/user/ImageUploader.svelte';
	import { enhance } from '$app/forms';
	import type { Database } from '$lib/types/supabase.types';

	type Props = {
		errorMessage: string | null | undefined;
		errorsListMessages: string[] | null | undefined;
		recipe: {
			title: string | null;
			type: Database['public']['Enums']['recipe_type'] | null;
			cook_time_minutes: number | null;
			cost: Database['public']['Enums']['recipe_cost'] | null;
			cover_image_url: string | null;
			created_at: string | null;
			description: string | null;
			difficulty: Database['public']['Enums']['recipe_difficulty'] | null;
			is_vegan: boolean | null;
			is_vegetarian: boolean | null;
			prep_time_minutes: number | null;
			servings: number | null;
			status: Database['public']['Enums']['recipe_status'] | null;
			ingredients: {
				id: number
				name: string
				quantity: number
				unit: string | null
				order: number | null
			}[],
			steps: {
				id: number
				step_number: number
				description: string
			}[]
		}
	}

	let { recipe, errorMessage, errorsListMessages }: Props = $props();

	let title = $derived(recipe.title);
	let description = $derived(recipe.description);
	let prep_time_minutes = $derived(recipe.prep_time_minutes);
	let cook_time_minutes = $derived(recipe.cook_time_minutes);
	let servings = $derived(recipe.servings);
	let difficulty = $derived(recipe.difficulty || 'facile');
	let type = $derived(recipe.type || 'plat');
	let status = $derived(recipe.status || 'draft');
	let cost = $derived(recipe.cost || 'bon marché');
	let is_vegetarian = $derived(recipe.is_vegetarian || false);
	let is_vegan = $derived(recipe.is_vegan || false);
	let cover_image_url = $derived(recipe.cover_image_url);

	let ingredients = $state(recipe.ingredients);
	let ingredientsJson = $derived(JSON.stringify(ingredients));
	let steps = $state(recipe.steps);
	let stepsJson = $derived(JSON.stringify(steps));

	let isSubmitting = $state(false);

	function addIngredient() {
		ingredients.push({
			name: '',
			quantity: 1,
			unit: 'g',
			id: Math.random(),
			order: ingredients.length + 1
		});
	}

	function removeIngredient(id: number) {
		ingredients = ingredients.filter((ing) => ing.id !== id);
	}

	function addStep() {
		steps = [...steps, { id: Math.random(), step_number: steps.length + 1, description: '' }];
	}

	function removeStep(id: number) {
		steps = steps.filter((step) => step.id !== id);
	}
</script>

<main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
	<form class="space-y-12" enctype="multipart/form-data" method="POST" use:enhance={() => {
    isSubmitting = true;

    return async ({ update }) => {
      isSubmitting = false;
      await update();
    };
  }}>
		<section>
			<h1 class="font-serif text-4xl font-bold text-primary md:text-5xl">Modifier la recette</h1>
			<p class="mt-2 text-lg text-on-surface/80">
				Apportez des modifications à votre recette et sauvegardez-les.
			</p>
		</section>

		<section class="space-y-8">
			<h2 class="font-serif text-3xl font-semibold text-on-surface">Informations Générales</h2>
			<TextInput bind:value={title} label="Titre de la recette" name="title"></TextInput>
			<TextInput bind:value={description} label="Description / Introduction" name="description"></TextInput>
			<span class="mb-2 block text-base font-medium text-on-surface">
				Image de présentation
			</span>
			<ImageUploader initialPreviewUrl={cover_image_url} name="cover_image"></ImageUploader>
		</section>

		<section class="space-y-8">
			<h2 class="font-serif text-3xl font-semibold text-on-surface">Détails</h2>
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
				<TextInput bind:value={prep_time_minutes} label="Temps de préparation (min)" name="prep_time_minutes"
									 type="number"></TextInput>
				<TextInput bind:value={cook_time_minutes} label="Temps de cuisson (min)" name="cook_time_minutes"
									 type="number"></TextInput>
				<TextInput bind:value={servings} label="Nombre de couverts" name="servings" type="number"></TextInput>
				<Dropdown bind:value={difficulty} label="Difficulté" name="difficulty">
					<option value="facile">Facile</option>
					<option value="moyen">Moyen</option>
					<option value="difficile">Difficile</option>
				</Dropdown>
				<Dropdown bind:value={type} label="Type de plat" name="type">
					<option value="entrée">Entrée</option>
					<option value="plat">Plat</option>
					<option value="dessert">Dessert</option>
					<option value="accompagnement">Accompagnement</option>
					<option value="boisson">Boisson</option>
				</Dropdown>
				<Dropdown bind:value={cost} label="Coût" name="cost">
					<option value="bon marché">Bon marché</option>
					<option value="moyen">Moyen</option>
					<option value="cher">Cher</option>
				</Dropdown>
				<div class="flex flex-wrap items-center gap-x-6 gap-y-2">
					<Checkbox bind:checked={is_vegetarian} label="Végétarien" name="vegetarian"></Checkbox>
					<Checkbox bind:checked={is_vegan} label="Végan" name="vegan"></Checkbox>
				</div>
			</div>
		</section>

		<section class="space-y-4">
			<div class="flex items-center justify-between">
				<h2 class="font-serif text-3xl font-semibold text-on-surface">Ingrédients</h2>
				<button
					class="rounded-full border-2 border-primary px-4 py-2 font-bold text-primary transition hover:bg-primary/10"
					onclick={addIngredient}
					type="button"
				>
					Ajouter
				</button>
			</div>
			<div class="space-y-4">
				<input bind:value={ingredientsJson} name="ingredients" type="hidden" />
				{#each ingredients as ingredient (ingredient.id)}
					<div transition:slide|local={{ duration: 300 }} class="grid grid-cols-[1fr_1fr_2fr_auto] items-center gap-2">
						<TextInput type="number" label="Qté" bind:value={ingredient.quantity}></TextInput>
						<TextInput label="Unité" bind:value={ingredient.unit}></TextInput>
						<TextInput label="Nom de l'ingrédient" bind:value={ingredient.name}></TextInput>
						<button
							aria-label="Supprimer l'ingrédient"
							type="button"
							onclick={() => removeIngredient(ingredient.id)}
							class="text-red-500 hover:text-red-700 hover:bg-red-500/25 rounded-full transition-colors p-3"
						>
							<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"
									 fill="currentColor">
								<path
									d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
							</svg>
						</button>
					</div>
				{/each}
			</div>
		</section>

		<section class="space-y-4">
			<div class="flex items-center justify-between">
				<h2 class="font-serif text-3xl font-semibold text-on-surface">Préparation</h2>
				<button
					class="rounded-full border-2 border-primary px-4 py-2 font-bold text-primary transition hover:bg-primary/10"
					onclick={addStep}
					type="button"
				>
					Ajouter
				</button>
			</div>
			<div class="space-y-6">
				<input bind:value={stepsJson} name="steps" type="hidden">
				{#each steps as step, i (step.id)}
					<div transition:slide|local={{ duration: 300 }} class="flex items-start gap-4">
						<span class="pt-2 font-serif text-2xl font-bold text-primary">{i + 1}.</span>
						<div class="flex-grow-1">
							<TextArea rows={3} bind:value={step.description} label="Description de cette étape"></TextArea>
						</div>
						<button
							aria-label="Supprimer l'étape"
							type="button"
							onclick={() => removeStep(step.id)}
							class="text-red-500 hover:text-red-700 hover:bg-red-500/25 rounded-full transition-colors p-3"
						>
							<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"
									 fill="currentColor">
								<path
									d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
							</svg>
						</button>
					</div>
				{/each}
			</div>
		</section>

		<section class="space-y-8">
			<h2 class="font-serif text-3xl font-semibold text-on-surface">Statut</h2>
			<div>
				<p class="mb-2 block text-base font-medium text-on-surface">Statut de la recette</p>
				<input bind:value={status} name="status" type="hidden">
				<div class="grid grid-cols-2 gap-2 rounded-full bg-surface p-1 shadow-inner">
					<button class="rounded-full p-3 font-bold transition-all" class:bg-primary={status === 'draft'}
									class:text-on-primary={status === 'draft'}
									onclick={() => status = 'draft'} type="button">Brouillon
					</button>
					<button class="rounded-full p-3 font-bold transition-all" class:bg-primary={status === 'published'}
									class:text-on-primary={status === 'published'}
									onclick={() => status = 'published'} type="button">Publié
					</button>
				</div>
			</div>
		</section>

		<div class="border-t border-primary/10 pt-8">

			{#if errorMessage}
				<p transition:slide class="text-lg font-bold text-red-800 text-center mb-6">{errorMessage}</p>
			{/if}
			{#if errorsListMessages}
				<ul class="text-lg font-bold text-red-800 text-center mb-6">
					{#each errorsListMessages as error}
						<li>{error}</li>
					{/each}
				</ul>
			{/if}
			<button
				class="disabled:bg-on-surface/50 w-full rounded-full bg-primary py-4 text-xl font-bold text-on-primary shadow-lg transition-transform hover:scale-105 active:scale-100"
				disabled={isSubmitting} type="submit">
				Enregistrer les modifications
			</button>
		</div>
	</form>
</main>
