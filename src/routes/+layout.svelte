<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Header from '$lib/client/components/Header.svelte';
	import Footer from '$lib/client/components/Footer.svelte';
	import MobileHeader from '$lib/client/components/MobileHeader.svelte';
	import '../app.css';
	import BottomNavigation from '$lib/client/components/BottomNavigation.svelte';

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

	<div class="max-sm:hidden">
		<Header />
	</div>
	<div class="max-sm:block hidden">
		<MobileHeader />
		<BottomNavigation />
	</div>

	<div class="min-h-screen mt-14 sm:mt-[84px]">
		{@render children()}
	</div>

	<div class="max-sm:mb-14">
		<Footer />
	</div>
</div>
