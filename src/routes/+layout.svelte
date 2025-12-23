<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { onMount } from 'svelte';
  import Header from '$lib/client/header/Header.svelte';
  import Footer from '$lib/client/footer/Footer.svelte';
  import MobileHeader from '$lib/client/header/MobileHeader.svelte';
  import BottomNavigation from '$lib/client/bottom-navigation/BottomNavigation.svelte';
  import '../app.css';

  let { children, data } = $props();
  let { supabase, session } = $derived(data);

  onMount(() => {
   const { data: { subscription } } = supabase.auth.onAuthStateChange((event, _session) => {
    if (_session?.expires_at !== session?.expires_at) {
     invalidate('supabase:auth');
    }
   });

   return () => subscription.unsubscribe();
  });
</script>

<div class="min-h-screen bg-background font-sans flex flex-col">

  <div class="hidden sm:block">
   <Header />
  </div>

  <div class="sm:hidden">
   <MobileHeader />
   <BottomNavigation />
  </div>

  <main class="flex-1 w-full mt-14 sm:mt-[84px]">
   {@render children()}
  </main>

  <div class="mb-14 sm:mb-0">
   <Footer />
  </div>

</div>
