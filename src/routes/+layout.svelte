<script lang="ts">
	import Header from '$lib/client/components/Header.svelte';
	import Footer from '$lib/client/components/Footer.svelte';
	import MobileHeader from '$lib/client/components/MobileHeader.svelte';
	import '../app.css';
	import BottomNavigation from '$lib/client/components/BottomNavigation.svelte';

	let { children } = $props();
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
