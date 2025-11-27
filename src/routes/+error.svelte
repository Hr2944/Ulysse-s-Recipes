<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
	<div class="mb-8 rounded-full bg-primary/5 p-8">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 fill-primary/40" viewBox="0 -960 960 960">
			<path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
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
