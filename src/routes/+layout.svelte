<script lang="ts">
	import Header from '$lib/client/header/Header.svelte';
	import Footer from '$lib/client/footer/Footer.svelte';
	import MobileHeader from '$lib/client/header/MobileHeader.svelte';
	import BottomNavigation from '$lib/client/bottom-navigation/BottomNavigation.svelte';
	import '@fontsource-variable/playfair-display';
	import '@fontsource-variable/playfair-display/wght-italic.css';
	import '@fontsource/lato/300.css';
	import '@fontsource/lato/400.css';
	import '@fontsource/lato/700.css';
	import '@fontsource/lato/900.css';
	import '../app.css';
	import LoadingBar from '$lib/client/loading-bar/LoadingBar.svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import logo from '$lib/assets/logo.png';

	let { children } = $props();

	let progressBar: ReturnType<typeof LoadingBar>;

	beforeNavigate(() => {
		progressBar?.start();
	});

	afterNavigate(() => {
		progressBar?.done();
	});
</script>

<svelte:head>
	<link href={logo} rel="icon" />
</svelte:head>

<LoadingBar bind:this={progressBar} />

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
