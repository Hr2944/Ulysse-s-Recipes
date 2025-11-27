<script lang="ts">
	const year = new Date().getFullYear();
</script>

<footer class="bg-primary/5 text-on-surface/80">
	<div class="mx-auto max-w-7xl px-6 py-12 lg:px-8">

		<div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">

			<!-- Brand -->
			<div>
				<div class="flex items-center gap-2 mb-4">
					<img src="/src/lib/assets/logo.png" alt="Logo" class="h-8 w-8 object-contain opacity-80" />
					<h2 class="font-serif text-2xl font-bold text-primary">Ulysse's Recipes</h2>
				</div>
				<p class="text-sm leading-6 max-w-sm">
					Découvrez le plaisir de cuisiner avec nos recettes simples, savoureuses et adaptées à tous les goûts.
					Fait avec amour par Ulysse.
				</p>
				<div class="mt-6 flex gap-4">
					<!-- Social Placeholders -->
					<a href="#" class="text-primary hover:text-primary/70 transition-colors" aria-label="Facebook">
						<svg class="h-6 w-6 fill-current" viewBox="0 -960 960 960"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-10-370v-110h-60v-70h60v-47q0-43 24-66.5t66-23.5q21 0 40 3l-3 63q-11 0-20.5 3t-12.5 12.5q-3 9.5-3 23v31h68l-7 70h-61v110h-90Z"/></svg>
					</a>
					<a href="#" class="text-primary hover:text-primary/70 transition-colors" aria-label="Instagram">
						<svg class="h-6 w-6 fill-current" viewBox="0 -960 960 960"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-216q-76 0-128-52t-52-128q0-76 52-128t128-52q76 0 128 52t52 128q0 76-52 128t-128 52Zm0-56q53 0 88.5-35.5T604-476q0-53-35.5-88.5T480-600q-53 0-88.5 35.5T356-476q0 53 35.5 88.5T480-352Zm202-208q15 0 25.5-10.5T718-596q0-15-10.5-25.5T682-632q-15 0-25.5 10.5T646-596q0 15 10.5 25.5T682-560ZM324-276h312q42 0 71-29t29-71v-208q0-42-29-71t-71-29H324q-42 0-71 29t-29 71v208q0 42 29 71t71 29Z"/></svg>
					</a>
				</div>
			</div>

			<!-- Navigation -->
			<div>
				<h3 class="text-sm font-bold uppercase tracking-wider text-on-surface">Navigation</h3>
				<ul class="mt-4 space-y-3 text-sm">
					<li><a class="transition-colors hover:text-primary hover:underline" href="/">Accueil</a></li>
					<li><a class="transition-colors hover:text-primary hover:underline" href="/search">Toutes les recettes</a></li>
					<li><a class="transition-colors hover:text-primary hover:underline" href="/search?sort=newest">Nouveautés</a></li>
					<li><a class="transition-colors hover:text-primary hover:underline" href="/auth">Mon Compte</a></li>
				</ul>
			</div>

			<!-- Legal -->
			<div>
				<h3 class="text-sm font-bold uppercase tracking-wider text-on-surface">Informations</h3>
				<ul class="mt-4 space-y-3 text-sm">
					<li><a class="transition-colors hover:text-primary hover:underline" href="#">Mentions Légales</a></li>
					<li><a class="transition-colors hover:text-primary hover:underline" href="#">Politique de Confidentialité</a></li>
					<li><a class="transition-colors hover:text-primary hover:underline" href="/sitemap.xml">Plan du site</a></li>
					<li><a class="transition-colors hover:text-primary hover:underline" href="#">Contact</a></li>
				</ul>
			</div>
		</div>

		<div class="mt-12 border-t border-primary/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-surface/60">
			<p>&copy; {year} Ulysse's Recipes. Tous droits réservés.</p>
			<p>Fait avec SvelteKit & Supabase.</p>
		</div>
	</div>
</footer>
