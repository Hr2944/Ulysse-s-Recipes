<script lang="ts">
	import { page } from '$app/state';
	import { alert_circle } from '$lib/assets/svg-paths';
</script>

<div class="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
	<div class="mb-8 rounded-full bg-primary/5 p-8">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 fill-primary/40" viewBox="0 -960 960 960">
			<path d={alert_circle} />
		</svg>
	</div>

	<h1 class="mb-4 font-serif text-5xl font-bold text-primary">
		{page.status}
	</h1>

	<p class="mb-8 max-w-md text-lg text-on-surface/80">
		{page.error?.message ?? "Une erreur inattendue s'est produite."}
	</p>

	<a
		href="/"
		class="rounded-full bg-primary px-8 py-3 font-bold text-on-primary shadow-lg transition-transform hover:scale-105 hover:bg-primary/90 active:scale-95"
	>
		Retour à l'accueil
	</a>
</div>
