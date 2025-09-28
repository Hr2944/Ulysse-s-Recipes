<script lang="ts">
	import Header from '$lib/client/components/Header.svelte';
	import Footer from '$lib/client/components/Footer.svelte';
	import '../app.css';

	let { children, data } = $props();
	let { session } = $derived(data);
</script>

<div class="min-h-screen bg-background text-text font-family-body flex flex-col">
	<Header session={session} />

	<div class="min-h-screen">
		{@render children()}
	</div>

	<Footer />
</div>
