<script lang="ts">
	import { page } from '$app/state';

	let focused = $state(false);

	let q = $derived(page.url.searchParams.get('q') ?? '');
</script>

<header
	class="sticky top-0 z-50 w-full backdrop-blur-md transition-all duration-300 bg-surface/80 shadow-sm">
	<nav
		class="mx-auto flex max-w-7xl items-center justify-between gap-4 p-4 transition-all duration-300"
	>

		<a class="flex items-center gap-2 transition-transform duration-300 hover:-translate-y-0.5" href="/">
			<enhanced:img alt="Logo" class="aspect-square w-12 h-12" src="/src/lib/assets/logo.png"></enhanced:img>
			<span
				class="hidden font-serif font-bold text-primary transition-all duration-300 sm:inline sm:text-2xl"
			>
				Ulysse's Recipes
			</span>
		</a>

		<div class="flex-grow">
			<form action="/search" class="relative mx-auto max-w-lg transition-all duration-300" method="GET">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
					<svg class="h-6 w-6 fill-on-surface/50 transition-colors duration-300" class:fill-primart={focused}
							 viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
					</svg>
				</div>
				<input
					bind:value={q}
					class="w-full rounded-full border-2 border-transparent bg-black/5 py-3 pl-12 pr-4 text-on-surface transition-all duration-300
                 placeholder:text-on-surface/50 focus:border-primart focus:bg-white focus:outline-none focus:ring-0 hover:shadow-inner"
					name="q"
					onfocusin={() => focused = true}
					onfocusout={() => focused = false}
					placeholder="Chercher une recette..."
					type="search"
				/>
			</form>
		</div>

		<div>
			<a aria-label="Mon compte"
				 class="flex items-center justify-center rounded-full border-2 border-primary p-2.5 text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/10 active:scale-95"
				 href="/auth">
				<svg class="h-6 w-6 fill-current" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
				</svg>
			</a>
		</div>

	</nav>
</header>
