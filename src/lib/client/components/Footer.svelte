<script lang="ts">
	const year = new Date().getFullYear();
</script>

<footer class="bg-primary/5 text-on-surface/80">
	<div class="mx-auto max-w-7xl px-6 py-12 lg:px-8">

		<div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">

			<!-- Brand -->
			<div>
				<div class="flex items-center gap-2 mb-4">
					<enhanced:img src="/src/lib/assets/logo.png" alt="Logo" class="h-8 w-8 object-contain"></enhanced:img>
					<h2 class="font-serif text-2xl font-bold text-primary">Ulysse's Recipes</h2>
				</div>
				<p class="text-sm leading-6 max-w-sm">
					Découvrez le plaisir de cuisiner avec nos recettes simples, savoureuses et adaptées à tous les goûts.
					Fait avec amour par Ulysse.
				</p>
			</div>

			<!-- Navigation -->
			<div>
				<h3 class="text-sm font-bold uppercase tracking-wider text-on-surface">Navigation</h3>
				<ul class="mt-4 space-y-3 text-sm">
					<li><a class="transition-colors hover:text-primary hover:underline" href="/">Accueil</a></li>
					<li><a class="transition-colors hover:text-primary hover:underline" href="/search">Toutes les recettes</a>
					</li>
					<li><a class="transition-colors hover:text-primary hover:underline" href="/search?sort=newest">Nouveautés</a>
					</li>
					<li><a class="transition-colors hover:text-primary hover:underline" href="/auth">Mon Compte</a></li>
				</ul>
			</div>

			<!-- Legal -->
<!--			<div>-->
<!--				<h3 class="text-sm font-bold uppercase tracking-wider text-on-surface">Informations</h3>-->
<!--				<ul class="mt-4 space-y-3 text-sm">-->
<!--					<li><a class="transition-colors hover:text-primary hover:underline" href="#">Mentions Légales</a></li>-->
<!--					<li><a class="transition-colors hover:text-primary hover:underline" href="#">Politique de Confidentialité</a>-->
<!--					</li>-->
<!--					<li><a class="transition-colors hover:text-primary hover:underline" href="/sitemap.xml">Plan du site</a></li>-->
<!--					<li><a class="transition-colors hover:text-primary hover:underline" href="#">Contact</a></li>-->
<!--				</ul>-->
<!--			</div>-->
		</div>

		<div
			class="mt-12 border-t border-primary/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-surface/60">
			<p>&copy; {year} Ulysse's Recipes. Tous droits réservés.</p>
		</div>
	</div>
</footer>
