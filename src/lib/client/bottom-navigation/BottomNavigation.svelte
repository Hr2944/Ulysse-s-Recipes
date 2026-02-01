<script lang="ts">
  import { page } from '$app/state';
  import { NAV_ITEMS } from '$lib/client/bottom-navigation/defaults';

  let path = $derived(page.url.pathname);
</script>

<nav class="fixed bottom-0 z-50 w-full border-t border-primary/10 bg-surface/90 pb-safe backdrop-blur-md">
  <div class="mx-auto grid h-16 max-w-md grid-cols-3">

   {#each NAV_ITEMS as item (item.href)}
    {@const isActive = item.regex.test(path)}

    <a
     class="group inline-flex flex-col items-center justify-center px-5 transition-colors hover:bg-primary/5 {isActive ? 'text-primary' : 'text-on-surface'}"
     href={item.href}
    >
     <svg
        aria-hidden="true"
        class="mb-1 h-8 w-16 rounded-full py-1 transition-colors {isActive ? 'bg-primary text-on-primary' : ''}"
        fill="currentColor"
        viewBox="0 -960 960 960"
     >
      <path d={item.path} />
     </svg>
     <span class="text-xs transition-colors {isActive ? 'font-extrabold' : ''}">
        {item.label}
     </span>
    </a>
   {/each}

  </div>
</nav>

<style>
    /* Keeps the navigation safe from the iOS home indicator */
    .pb-safe {
        padding-bottom: env(safe-area-inset-bottom);
    }
</style>
