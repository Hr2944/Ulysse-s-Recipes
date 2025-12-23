<script lang="ts">
	import { slide } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import Checkbox from '$lib/client/inputs/Checkbox.svelte';
	import TextInput from '$lib/client/inputs/TextInput.svelte';
	import Dropdown from '$lib/client/inputs/Dropdown.svelte';
	import TextArea from '$lib/client/inputs/TextArea.svelte';
	import ImageUploader from '$lib/client/user/ImageUploader.svelte';
	import type { Database } from '$lib/types/supabase.types';

	type RecipeData = {
		title: string | null;
		type: Database['public']['Enums']['recipe_type'] | null;
		cook_time_minutes: number | null;
		cost: Database['public']['Enums']['recipe_cost'] | null;
		cover_image_url: string | null;
		description: string | null;
		difficulty: Database['public']['Enums']['recipe_difficulty'] | null;
		is_vegan: boolean | null;
		is_vegetarian: boolean | null;
		prep_time_minutes: number | null;
		servings: number | null;
		status: Database['public']['Enums']['recipe_status'] | null;
		ingredients: { id: number; name: string; quantity: number; unit: string | null; order: number | null }[];
		steps: { id: number; step_number: number; description: string }[];
	};

	type Props = {
		editorMode: 'create' | 'edit';
		errorMessage: string | null | undefined;
		errorsListMessages: string[] | null | undefined;
		recipe: RecipeData;
	};

	let { recipe, errorMessage, errorsListMessages, editorMode }: Props = $props();

	// 1. Consolidated State: Initialize one reactive object from props
	let form = $derived({
		title: recipe.title ?? '',
		description: recipe.description ?? '',
		prep_time_minutes: recipe.prep_time_minutes,
		cook_time_minutes: recipe.cook_time_minutes,
		servings: recipe.servings,
		difficulty: recipe.difficulty || 'facile',
		type: recipe.type || 'plat',
		status: recipe.status || 'draft',
		cost: recipe.cost || 'bon marché',
		is_vegetarian: recipe.is_vegetarian || false,
		is_vegan: recipe.is_vegan || false,
		cover_image_url: recipe.cover_image_url,
		ingredients: recipe.ingredients ?? [],
		steps: recipe.steps ?? []
	});

	// Derived JSON for form submission
	let ingredientsJson = $derived(JSON.stringify(form.ingredients));
	let stepsJson = $derived(JSON.stringify(form.steps));

	let isSubmitting = $state(false);

	// Optimized Array Operations
	const addIngredient = () => {
		form.ingredients.push({
			name: '',
			quantity: 1,
			unit: 'g',
			id: Math.random(), // Note: Ideally use a UUID or negative ID for new items if DB expects specific ID types
			order: form.ingredients.length + 1
		});
	};

	const removeIngredient = (id: number) => {
		form.ingredients = form.ingredients.filter((ing) => ing.id !== id);
	};

	const addStep = () => {
		form.steps.push({
			id: Math.random(),
			step_number: form.steps.length + 1,
			description: ''
		});
	};

	const removeStep = (id: number) => {
		form.steps = form.steps.filter((step) => step.id !== id);
	};
</script>

<main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
	<form
		class="space-y-12"
		enctype="multipart/form-data"
		method="POST"
		use:enhance={() => {
        isSubmitting = true;
        return async ({ update }) => {
            isSubmitting = false;
            await update();
        };
    }}
	>
		<section>
			<h1 class="font-serif text-4xl font-bold text-primary md:text-5xl">
				{editorMode === 'edit' ? 'Modifier la recette' : 'Créer une recette'}
			</h1>
			<p class="mt-2 text-lg text-on-surface/80">
				{editorMode === 'edit' ? 'Apportez des modifications à votre recette et sauvegardez-les.' : 'Créer et sauvegarder une nouvelle recette.'}
			</p>
		</section>

		<section class="space-y-8">
			<h2 class="font-serif text-3xl font-semibold text-on-surface">Informations Générales</h2>
			<TextInput bind:value={form.title} label="Titre de la recette" name="title" />
			<TextInput bind:value={form.description} label="Description / Introduction" name="description" />
			<div>
				<span class="mb-2 block text-base font-medium text-on-surface">Image de présentation</span>
				<ImageUploader initialPreviewUrl={form.cover_image_url} name="cover_image" />
			</div>
		</section>

		<section class="space-y-8">
			<h2 class="font-serif text-3xl font-semibold text-on-surface">Détails</h2>
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
				<TextInput bind:value={form.prep_time_minutes} label="Temps de préparation (min)" name="prep_time_minutes"
									 type="number" />
				<TextInput bind:value={form.cook_time_minutes} label="Temps de cuisson (min)" name="cook_time_minutes"
									 type="number" />
				<TextInput bind:value={form.servings} label="Nombre de couverts" name="servings" type="number" />

				<Dropdown bind:value={form.difficulty} label="Difficulté" name="difficulty">
					<option value="facile">Facile</option>
					<option value="moyen">Moyen</option>
					<option value="difficile">Difficile</option>
				</Dropdown>

				<Dropdown bind:value={form.type} label="Type de plat" name="type">
					<option value="entrée">Entrée</option>
					<option value="plat">Plat</option>
					<option value="dessert">Dessert</option>
					<option value="accompagnement">Accompagnement</option>
					<option value="boisson">Boisson</option>
				</Dropdown>

				<Dropdown bind:value={form.cost} label="Coût" name="cost">
					<option value="bon marché">Bon marché</option>
					<option value="moyen">Moyen</option>
					<option value="cher">Cher</option>
				</Dropdown>

				<div class="flex flex-wrap items-center gap-x-6 gap-y-2">
					<Checkbox bind:checked={form.is_vegetarian} label="Végétarien" name="vegetarian" />
					<Checkbox bind:checked={form.is_vegan} label="Végan" name="vegan" />
				</div>
			</div>
		</section>

		<section class="space-y-6">
			<div class="flex items-center justify-between border-b border-primary/10 pb-4">
				<h2 class="font-serif text-3xl font-semibold text-primary">Ingrédients</h2>
				<button
					class="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 font-bold text-primary transition-colors hover:bg-primary/20 active:scale-95"
					onclick={addIngredient}
					type="button"
				>
					<svg class="h-5 w-5 fill-current" viewBox="0 -960 960 960">
						<path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
					</svg>
					Ajouter
				</button>
			</div>

			<div class="space-y-4">
				<input name="ingredients" type="hidden" value={ingredientsJson} />

				{#each form.ingredients as ingredient (ingredient.id)}
					<div transition:slide|local={{ duration: 300 }}
							 class="relative rounded-2xl bg-surface p-4 shadow-sm border border-primary/5 sm:flex sm:items-center sm:gap-4">
						<div class="grid grid-cols-2 gap-4 sm:shrink-0 sm:w-1/3">
							<TextInput type="number" label="Qté" bind:value={ingredient.quantity} />
							<TextInput label="Unité" bind:value={ingredient.unit} />
						</div>
						<div class="mt-4 sm:mt-0 sm:grow">
							<TextInput label="Nom de l'ingrédient" bind:value={ingredient.name} />
						</div>
						<button
							aria-label="Supprimer l'ingrédient"
							type="button"
							onclick={() => removeIngredient(ingredient.id)}
							class="absolute -right-2 -top-2 p-2 bg-surface rounded-full shadow-md text-red-500 hover:text-red-700 hover:bg-red-300 transition-colors sm:static sm:shadow-none sm:bg-transparent"
						>
							<svg height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
								<path
									d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
							</svg>
						</button>
					</div>
				{/each}

				{#if form.ingredients.length === 0}
					<div
						class="text-center py-8 text-on-surface/50 italic bg-primary/5 rounded-2xl border border-dashed border-primary/20">
						Aucun ingrédient ajouté.
					</div>
				{:else}
					<button
						class="w-full flex items-center justify-center gap-2 rounded-full bg-primary p-4 font-bold text-on-primary transition-transform hover:-translate-y-0.5"
						onclick={addIngredient}
						type="button"
					>
						<svg class="h-5 w-5 fill-current" viewBox="0 -960 960 960">
							<path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
						</svg>
						Ajouter Un Ingrédient
					</button>
				{/if}
			</div>
		</section>

		<section class="space-y-6">
			<div class="flex items-center justify-between border-b border-primary/10 pb-4">
				<h2 class="font-serif text-3xl font-semibold text-primary">Préparation</h2>
				<button
					class="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 font-bold text-primary transition-colors hover:bg-primary/20 active:scale-95"
					onclick={addStep}
					type="button"
				>
					<svg class="h-5 w-5 fill-current" viewBox="0 -960 960 960">
						<path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
					</svg>
					Ajouter
				</button>
			</div>

			<div class="space-y-6">
				<input name="steps" type="hidden" value={stepsJson}>

				{#each form.steps as step, i (step.id)}
					<div transition:slide|local={{ duration: 300 }}
							 class="flex items-start gap-4 rounded-2xl bg-surface p-4 shadow-sm border border-primary/5">
						<span
							class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary font-bold">{i + 1}</span>
						<div class="grow">
							<TextArea rows={3} bind:value={step.description} label="Description de l'étape" />
						</div>
						<button
							aria-label="Supprimer l'étape"
							type="button"
							onclick={() => removeStep(step.id)}
							class="text-red-500 hover:text-red-700 hover:bg-red-300 rounded-full transition-colors p-2"
						>
							<svg height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
								<path
									d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
							</svg>
						</button>
					</div>
				{/each}

				{#if form.steps.length === 0}
					<div
						class="text-center py-8 text-on-surface/50 italic bg-primary/5 rounded-2xl border border-dashed border-primary/20">
						Aucune étape ajoutée.
					</div>
				{:else}
					<button
						class="w-full flex items-center justify-center gap-2 rounded-full bg-primary p-4 font-bold text-on-primary transition-transform hover:-translate-y-0.5"
						onclick={addStep}
						type="button"
					>
						<svg class="h-5 w-5 fill-current" viewBox="0 -960 960 960">
							<path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
						</svg>
						Ajouter Une Étape
					</button>
				{/if}
			</div>
		</section>

		<section class="space-y-8">
			<h2 class="font-serif text-3xl font-semibold text-on-surface">Statut</h2>
			<div>
				<input bind:value={form.status} name="status" type="hidden">
				<div class="grid grid-cols-2 gap-2 rounded-full bg-surface p-1 shadow-inner">
					<button
						class="rounded-full p-3 font-bold transition-colors {form.status === 'draft' ? 'text-on-primary bg-primary' : 'hover:bg-primary/10'}"
						onclick={() => form.status = 'draft'}
						type="button"
					>
						Brouillon
					</button>
					<button
						class="rounded-full p-3 font-bold transition-colors {form.status === 'published' ? 'text-on-primary bg-primary' : 'hover:bg-primary/10'}"
						onclick={() => form.status = 'published'}
						type="button"
					>
						Publié
					</button>
				</div>
			</div>
		</section>

		<div class="border-t border-primary/10 pt-8">
			{#if errorMessage}
				<p transition:slide class="text-lg font-bold text-red-800 text-center mb-6">{errorMessage}</p>
			{/if}
			{#if errorsListMessages?.length}
				<ul class="text-lg font-bold text-red-800 text-center mb-6 list-none">
					{#each errorsListMessages as error}
						<li>{error}</li>
					{/each}
				</ul>
			{/if}

			<button
				class="disabled:bg-on-surface/50 w-full rounded-full bg-primary py-4 text-xl font-bold text-on-primary shadow-lg transition-transform hover:scale-105 active:scale-100 disabled:cursor-not-allowed"
				disabled={isSubmitting}
				type="submit"
			>
				{editorMode === 'edit' ? 'Enregistrer les modifications' : 'Enregistrer la recette'}
			</button>
		</div>
	</form>
</main>
