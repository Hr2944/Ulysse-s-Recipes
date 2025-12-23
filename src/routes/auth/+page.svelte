<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import TextInput from '$lib/client/inputs/TextInput.svelte';
	import type { PageProps } from './$types';
	import { tabActiveClass, tabBaseClass, tabInactiveClass } from './defaults';

	let { form, data }: PageProps = $props();

	$effect(() => {
		if (data.session) goto('/user');
	});

	let activeTab = $state<'connexion' | 'inscription'>('connexion');
	let isSubmitting = $state(false);
</script>

<main class="flex min-h-screen w-full items-center justify-center bg-surface p-4">

	<div class="w-full max-w-md rounded-3xl bg-white p-6 pt-8 shadow-xl md:p-10">

		<header class="text-center">
			<h1 class="font-serif text-5xl font-medium text-primary">
				Bonjour !
			</h1>
			<p class="mt-2 text-lg text-on-surface/80">
				Connectez-vous pour gérer vos recettes.
			</p>
		</header>

		<div class="my-8 flex rounded-full bg-primary/5 p-1">
			<button
				class="{tabBaseClass} {activeTab === 'connexion' ? tabActiveClass : tabInactiveClass}"
				onclick={() => activeTab = 'connexion'}>
				Connexion
			</button>
			<button
				class="{tabBaseClass} {activeTab === 'inscription' ? tabActiveClass : tabInactiveClass}"
				onclick={() => activeTab = 'inscription'}>
				Inscription
			</button>
		</div>

		{#if activeTab === 'connexion'}
			<form
				method="POST"
				action="?/login"
				in:fade={{ duration: 200, delay: 100 }}
				class="space-y-6 mt-10"
				use:enhance={() => {
      isSubmitting = true;
      return async ({ update }) => {
       isSubmitting = false;
       await update();
      };
     }}
			>
				<TextInput name="email" type="email" label="Adresse e-mail" />

				<button
					disabled={isSubmitting}
					type="submit"
					class="w-full rounded-full py-4 text-xl font-bold text-on-primary shadow-lg transition-transform duration-200
             bg-primary hover:scale-[1.02] active:scale-[0.98]
             disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
				>
					Envoyer le lien de connexion
				</button>
			</form>

		{:else}
			<div in:fade={{ duration: 200 }}>
				<h3 class="font-bold my-6 text-xl text-center">La création de compte est désactivée.</h3>
				<button
					disabled
					class="w-full cursor-not-allowed rounded-full bg-gray-400 py-4 text-xl font-bold text-on-primary shadow-lg">
					Créer mon compte
				</button>
			</div>
		{/if}

		{#if form && !isSubmitting}
			<p
				transition:slide
				class="mt-3 text-center text-lg font-bold {form.success ? 'text-primary' : 'text-red-800'}"
			>
				{form.success ? 'Vous avez reçu un lien de connexion par email !' : "Une erreur s'est produite, veuillez réessayer ."}
			</p>
		{/if}

	</div>
</main>
