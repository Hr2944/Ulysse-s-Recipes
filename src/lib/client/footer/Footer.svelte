<script lang="ts">
  const year = new Date().getFullYear();
</script>

<footer class="bg-primary/5 text-on-surface/80">
  <div class="mx-auto max-w-7xl px-6 py-12 lg:px-8">

   <div class="flex gap-8 max-md:flex-col lg:gap-12">

    <div>
     <div class="mb-4 flex items-center gap-2">
      <enhanced:img
        src="/src/lib/assets/logo.png"
        alt="Logo"
        class="h-8 w-8 object-contain"
        loading="lazy"
        decoding="async"
      ></enhanced:img>
      <h2 class="font-serif text-2xl font-bold text-primary">Ulysse's Recipes</h2>
     </div>
     <p class="max-w-sm text-sm leading-6">
      Découvrez le plaisir de cuisiner avec nos recettes simples, savoureuses et adaptées à tous les goûts.
      Fait avec amour par Ulysse.
     </p>
    </div>

    <div>
     <h3 class="text-sm font-bold uppercase tracking-wider text-on-surface">Navigation</h3>
     <ul class="mt-4 space-y-3 text-sm">
      <li><a class="transition-colors hover:text-primary hover:underline" href="/">Accueil</a></li>
      <li><a class="transition-colors hover:text-primary hover:underline" href="/search">Toutes les recettes</a></li>
      <li><a class="transition-colors hover:text-primary hover:underline" href="/search?sort=newest">Nouveautés</a></li>
      <li><a class="transition-colors hover:text-primary hover:underline" href="/auth">Mon Compte</a></li>
     </ul>
    </div>
   </div>

   <div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary/10 pt-8 text-xs text-on-surface/60 md:flex-row">
    <p>&copy; {year} Ulysse's Recipes. Tous droits réservés.</p>
   </div>
  </div>
</footer>
