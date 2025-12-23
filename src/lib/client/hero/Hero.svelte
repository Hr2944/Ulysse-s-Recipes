<section
  class="relative mx-4 my-6 overflow-hidden rounded-[3rem] border border-white/50 bg-linear-to-br from-primary/5 via-secondary/20 to-primary/5 px-6 py-24 text-center shadow-sm sm:px-16 sm:py-32 lg:px-48"
>
  <div class="relative z-10 mx-auto max-w-3xl">
   <h1 class="animate-fade-in text-5xl font-serif font-bold tracking-tight text-primary drop-shadow-sm sm:text-7xl">
    La cuisine d'Ulysse
   </h1>

   <p class="animate-fade-in mx-auto mt-8 text-xl font-light leading-8 text-on-surface/80 [animation-delay:200ms]">
    Découvrez une collection de recettes savoureuses, simples et gourmandes pour tous les jours.
   </p>

   <div class="animate-fade-in mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row [animation-delay:400ms]">
    <a
     class="w-full rounded-full bg-primary px-8 py-4 text-base font-bold text-on-primary shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-primary/90 hover:shadow-2xl sm:w-auto"
     href="/search">
     Explorer les recettes
    </a>
    <a
     class="flex items-center gap-2 text-base font-bold text-primary transition-colors hover:text-primary/80"
     href="#latest-recipes">
     Voir les nouveautés
    </a>
   </div>
  </div>

  <div class="absolute left-1/2 top-0 z-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/10 blur-3xl"></div>
  <div class="absolute bottom-0 right-0 z-0 h-[600px] w-[600px] translate-x-1/3 translate-y-1/3 rounded-full bg-primary/5 blur-3xl"></div>
</section>

<style>
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    opacity: 0;
    animation: fadeIn 0.8s ease-out forwards;
  }
</style>
