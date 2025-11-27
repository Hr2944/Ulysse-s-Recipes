<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import TextInput from '$lib/client/components/input/TextInput.svelte';

	let { form }: PageProps = $props();

	let activeTab = $state<'connexion' | 'inscription'>('connexion');
	let isSubmitting = $state(false);
</script>

<main class="flex min-h-screen w-full items-center justify-center bg-surface p-4">

	<div class="w-full max-w-md rounded-3xl bg-white p-6 pt-8 shadow-xl md:p-10">

		<div class="text-center">
			<h1 class="font-serif text-5xl font-medium text-primary">
				Bonjour !
			</h1>
			<p class="mt-2 text-lg text-on-surface/80">
				Connectez-vous pour gérer vos recettes.
			</p>
		</div>

		<div class="my-8 flex rounded-full bg-primary/5 p-1">
			<button
				class="flex-1 rounded-full py-3 text-sm font-bold transition-all duration-300
              {activeTab === 'connexion' ? 'bg-white text-primary shadow-sm' : 'text-on-surface/60 hover:bg-primary/10'}"
				onclick={() => activeTab = 'connexion'}>
				Connexion
			</button>
			<button
				class="flex-1 rounded-full py-3 text-sm font-bold transition-all duration-300
              {activeTab === 'inscription' ? 'bg-white text-primary shadow-sm' : 'text-on-surface/60 hover:bg-primary/10'}"
				onclick={() => activeTab = 'inscription'}>
				Inscription
			</button>
		</div>

		{#if activeTab === 'connexion'}
			<form method="POST" action="?/login" in:fade={{ duration: 200, delay: 100 }} class="space-y-6 mt-10" use:enhance={() => {
				isSubmitting = true;

				return async ({ update }) => {
					isSubmitting = false;
					await update();
				};
				}}>
				<TextInput name="email" type="email" label="Adresse e-mail" />

				<button
					disabled={isSubmitting}
					class:bg-gray-400={isSubmitting}
					class:bg-primary={!isSubmitting}
					type="submit"
					class="w-full rounded-full py-4 text-xl font-bold text-on-primary shadow-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
					Envoyer le lien de connexion
				</button>
			</form>

		{:else}
			<form method="POST" action="?/signup" use:enhance in:fade={{ duration: 200, delay: 100 }} class="space-y-6">
				<TextInput name="email" type="email" label="Adresse e-mail" />
				<TextInput name="username" type="text" label="Pseudonyme" />

				<button
					type="submit"
					class="w-full rounded-full bg-primary py-4 text-xl font-bold text-on-primary shadow-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
					Créer mon compte
				</button>
			</form>
		{/if}

		{#if form && !isSubmitting}
			{#if form.success}
				<p transition:slide class="text-lg mt-3 text-center text-primary font-bold">Vous avez reçu un lien de
					connexion par email !</p>
			{:else}
				<p transition:slide class="text-lg mt-3 text-center text-red-800 font-bold">Une erreur s'est produite, veuillez
					retenter.</p>
			{/if}
		{/if}
	</div>
</main>
