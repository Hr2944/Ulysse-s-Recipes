<script lang="ts">
	import { fade } from 'svelte/transition';
</script>

<div
	class="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/20 to-primary/5 px-6 py-24 text-center sm:px-16 sm:py-32 lg:px-48 rounded-[3rem] my-6 mx-4 shadow-sm border border-white/50">
	<div class="relative z-10 max-w-3xl mx-auto">
		<!--		<span-->
		<!--			class="inline-block rounded-full bg-white/60 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm backdrop-blur-sm mb-8"-->
		<!--			in:fade={{ duration: 800, delay: 100 }}>-->
		<!--			Nouvelle Collection-->
		<!--		</span>-->
		<h1 class="text-5xl font-serif font-bold tracking-tight text-primary sm:text-7xl drop-shadow-sm"
				in:fade>
			La cuisine d'Ulysse
		</h1>
		<p class="mx-auto mt-8 text-xl leading-8 text-on-surface/80 font-light" in:fade={{ delay: 200 }}>
			Découvrez une collection de recettes savoureuses, simples et gourmandes pour tous les jours.
		</p>
		<div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6"
				 in:fade={{ delay: 400 }}>
			<a
				class="w-full sm:w-auto rounded-full bg-primary px-8 py-4 text-base font-bold text-on-primary shadow-xl hover:bg-primary/90 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
				href="/search">
				Explorer les recettes
			</a>
			<a class="text-base font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
				 href="#latest-recipes">
				Voir les nouveautés
			</a>
		</div>
	</div>


	<div
		class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-3xl -z-0 animate-pulse"></div>
	<div
		class="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-0"></div>
</div>
