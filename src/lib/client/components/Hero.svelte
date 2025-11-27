<script lang="ts">
	import { fade } from 'svelte/transition';
</script>

<div class="relative overflow-hidden bg-primary/5 px-6 py-16 text-center sm:px-16 sm:py-24 lg:px-48 rounded-3xl my-6 mx-4">
	<div class="relative z-10 max-w-2xl mx-auto">
		<h1 class="text-4xl font-serif font-bold tracking-tight text-primary sm:text-6xl" in:fade={{ duration: 800, delay: 200 }}>
			La cuisine d'Ulysse
		</h1>
		<p class="mx-auto mt-6 text-lg leading-8 text-on-surface/80" in:fade={{ duration: 800, delay: 400 }}>
			Découvrez une collection de recettes savoureuses, simples et gourmandes pour tous les jours.
		</p>
		<div class="mt-10 flex items-center justify-center gap-x-6" in:fade={{ duration: 800, delay: 600 }}>
			<a href="/search"
				 class="rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-on-primary shadow-lg hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all hover:-translate-y-1">
				Explorer les recettes
			</a>
			<a href="/search?sort=newest" class="text-sm font-semibold leading-6 text-primary hover:text-primary/80 transition-colors">
				Voir les nouveautés <span aria-hidden="true">→</span>
			</a>
		</div>
	</div>

    <!-- Decorative background elements -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl -z-0"></div>
</div>
