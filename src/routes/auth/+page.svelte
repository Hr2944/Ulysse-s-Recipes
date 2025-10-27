<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

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

		<!--		<div class="my-10 grid grid-cols-2 gap-2 rounded-full bg-surface p-1 shadow-inner">-->
		<!--			<button-->
		<!--				class="rounded-full p-3 text-base font-bold transition-all duration-300-->
		<!--              {activeTab === 'connexion' ? 'bg-primary text-on-primary shadow-md' : 'text-primary/70 hover:bg-primary/10'}"-->
		<!--				onclick={() => activeTab = 'connexion'}>-->
		<!--				Connexion-->
		<!--			</button>-->
		<!--			<button-->
		<!--				class="rounded-full p-3 text-base font-bold transition-all duration-300-->
		<!--              {activeTab === 'inscription' ? 'bg-primary text-on-primary shadow-md' : 'text-primary/70 hover:bg-primary/10'}"-->
		<!--				onclick={() => activeTab = 'inscription'}>-->
		<!--				Inscription-->
		<!--			</button>-->
		<!--		</div>-->

		{#if activeTab === 'connexion'}
			<form method="POST" action="?/login" in:fade={{ duration: 200, delay: 100 }} class="space-y-6 mt-10" use:enhance={() => {
				isSubmitting = true;

				return async ({ update }) => {
					isSubmitting = false;
					await update();
				};
				}}>
				<div class="group relative">
					<input
						name="email"
						type="email"
						id="email-login"
						class="peer w-full rounded-t-lg border-b-2 border-on-surface/30 bg-black/5 p-4 text-lg text-on-surface transition placeholder:text-transparent focus:border-secondary focus:outline-none"
						placeholder="email"
					/>
					<label
						for="email-login"
						class="pointer-events-none absolute left-4 top-4 text-lg text-on-surface/60 transition-all group-focus-within:-translate-y-4 group-focus-within:text-xs group-focus-within:text-secondary
                  peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-lg peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:text-xs">
						Adresse e-mail
					</label>
				</div>

				<button
					disabled={isSubmitting}
					class:bg-gray-400={isSubmitting}
					class:bg-secondary={!isSubmitting}
					type="submit"
					class="w-full rounded-full py-4 text-xl font-bold text-on-secondary shadow-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
					Envoyer le lien de connexion
				</button>
			</form>

		{:else}
			<form method="POST" action="?/signup" use:enhance in:fade={{ duration: 200, delay: 100 }} class="space-y-6">
				<div class="group relative">
					<input type="email" id="email-register" name="email"
								 class="peer w-full rounded-t-lg border-b-2 border-on-surface/30 bg-black/5 p-4 text-lg text-on-surface transition placeholder:text-transparent focus:border-secondary focus:outline-none"
								 placeholder="email" />
					<label for="email-register"
								 class="pointer-events-none absolute left-4 top-4 text-lg text-on-surface/60 transition-all group-focus-within:-translate-y-4 group-focus-within:text-xs group-focus-within:text-secondary peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-lg peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:text-xs">
						Adresse e-mail
					</label>
				</div>

				<div class="group relative">
					<input type="text" id="username" name="username"
								 class="peer w-full rounded-t-lg border-b-2 border-on-surface/30 bg-black/5 p-4 text-lg text-on-surface transition placeholder:text-transparent focus:border-secondary focus:outline-none"
								 placeholder="username" />
					<label for="username"
								 class="pointer-events-none absolute left-4 top-4 text-lg text-on-surface/60 transition-all group-focus-within:-translate-y-4 group-focus-within:text-xs group-focus-within:text-secondary peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-lg peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:text-xs">
						Pseudonyme
					</label>
				</div>

				<button
					type="submit"
					class="w-full rounded-full bg-secondary py-4 text-xl font-bold text-on-secondary shadow-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
					Créer mon compte
				</button>
			</form>
		{/if}

		{#if form && !isSubmitting}
			{#if form.success}
				<p transition:slide class="text-lg mt-3 text-center text-green-800 font-bold">Vous avez reçu un lien de
					connexion par email !</p>
			{:else}
				<p transition:slide class="text-lg mt-3 text-center text-red-800 font-bold">Une erreur s'est produite, veuillez
					retenter.</p>
			{/if}
		{/if}
	</div>
</main>
