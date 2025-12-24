<script lang="ts">
  import { page } from '$app/state';
  import { account_circled, search } from '$lib/assets/svg-paths';

  let q = $derived(page.url.searchParams.get('q') ?? '');
</script>

<header class="fixed top-0 z-50 w-full bg-surface/80 backdrop-blur-md shadow-sm">
  <nav class="mx-auto flex max-w-7xl items-center justify-between gap-4 p-4">

   <a class="flex items-center gap-2 transition-transform duration-300 hover:-translate-y-0.5" href="/">
    <enhanced:img
        alt="Logo"
        class="h-12 w-12 object-contain"
        src="/src/lib/assets/logo.png"
        fetchpriority="high"
        loading="eager"
    ></enhanced:img>
    <span class="hidden font-serif font-bold text-primary sm:inline sm:text-2xl">
     Ulysse's Recipes
    </span>
   </a>

   <div class="grow">
    <form action="/search" class="group relative mx-auto max-w-lg" method="GET">
     <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
      <svg
        class="h-6 w-6 fill-on-surface/50 transition-colors duration-300 group-focus-within:fill-primary"
        viewBox="0 -960 960 960">
       <path d={search} />
      </svg>
     </div>

     <input
      bind:value={q}
      class="w-full rounded-full border-2 border-transparent bg-black/5 py-3 pl-12 pr-4 text-on-surface shadow-sm transition-all duration-300
             placeholder:text-on-surface/50 hover:bg-black/10
             focus:border-primary/20 focus:bg-white focus:outline-none focus:shadow-md"
      name="q"
      placeholder="Chercher une recette..."
      type="search"
     />
    </form>
   </div>

   <div>
    <a
      aria-label="Mon compte"
      class="flex items-center justify-center rounded-full border-2 border-primary p-2.5 text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/10 active:scale-95"
      href="/user">
     <svg class="h-6 w-6 fill-current" viewBox="0 -960 960 960">
      <path d={account_circled} />
     </svg>
    </a>
   </div>

  </nav>
</header>
