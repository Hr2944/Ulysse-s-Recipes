<script lang="ts">
	const year = new Date().getFullYear();
</script>

<footer class="bg-primary/5 text-on-surface/80">
	<div class="mx-auto max-w-7xl px-6 py-12 lg:px-8">

		<div class="grid grid-cols-2 gap-8">

			<div class="md:col-span-2 lg:col-span-1">
				<h2 class="font-serif text-2xl font-bold text-primary">Ulysse's Recipes</h2>
				<p class="mt-4 text-base">La cuisine moderne, simple et accessible pour tous les gourmands.</p>
			</div>

			<div>
				<h3 class="text-base font-semibold text-on-surface">Navigation</h3>
				<ul class="mt-4 space-y-2">
					<li><a class="transition-colors hover:text-primary" href="/">Accueil</a></li>
					<li><a class="transition-colors hover:text-primary" href="/search">Toutes les recettes</a></li>
					<li><a class="transition-colors hover:text-primary" href="/sitemap.xml">Plan du site</a></li>
				</ul>
			</div>
		</div>
		<div class="w-full mt-12 border-t border-primary/10 pt-8 text-center text-sm text-on-surface/60">
				<p>&copy; {year} Ulysse's Recipes. Tous droits réservés.</p>
			</div>
	</div>
</footer>
