<script lang="ts">
	import Header from '$lib/client/components/Header.svelte';
	import Footer from '$lib/client/components/Footer.svelte';
	import '../app.css';
	import BottomNavigation from '$lib/client/components/BottomNavigation.svelte';

	let { children } = $props();
</script>

<div class="min-h-screen bg-background text-text font-family-body flex flex-col">

	<div class="max-sm:hidden">
		<Header />
	</div>
	<div class="max-sm:block hidden">
		<BottomNavigation></BottomNavigation>
	</div>

	<div class="min-h-screen sm:mt-20">
		{@render children()}
	</div>

	<div class="max-sm:mb-20">
		<Footer />
	</div>
</div>
