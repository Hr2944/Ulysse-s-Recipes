<script lang="ts">
	type Props = {
		name: string;
		initialPreviewUrl?: string | null;
	};

	const { name, initialPreviewUrl = null }: Props = $props();

	let previewUrl = $state<string | null>(initialPreviewUrl);

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) {
			return;
		}

		if (!file.type.startsWith('image/')) {
			alert('Le fichier doit être une image.');
			return;
		}
		if (file.size > 5 * 1024 * 1024) {
			alert('L\'image ne doit pas dépasser 5 Mo.');
			return;
		}

		if (previewUrl && previewUrl.startsWith('blob:')) {
			URL.revokeObjectURL(previewUrl);
		}
		previewUrl = URL.createObjectURL(file);
	}
</script>

<div class="w-full">
	<label
		class="relative flex h-64 w-full cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-primary/50 bg-primary/5 text-center transition-colors hover:border-primary hover:bg-primary/10"
	>
		{#if previewUrl}
			<img src={previewUrl} alt="Présentation de la recette" class="h-full w-full rounded-2xl object-cover" />
			<div
				class="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/50 text-white opacity-0 transition-opacity hover:opacity-100">
				<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" fill="currentColor">
					<path
						d="M440-200h80v-167l64 64 56-57-160-160-160 160 57 56 63-63v167ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520Z" />
				</svg>
				<p class="mt-2 font-bold">Changer l'image</p>
			</div>
		{/if}

		{#if !previewUrl}
			<div class="text-on-surface/70 flex flex-col items-center">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 fill-current" viewBox="0 -960 960 960" fill="#e3e3e3">
					<path
						d="M480-480ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h320v80H200v560h560v-320h80v320q0 33-23.5 56.5T760-120H200Zm40-160h480L570-480 450-320l-90-120-120 160Zm440-320v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z" />
				</svg>
				<p class="mt-4 font-semibold">Cliquez ou glissez une image ici</p>
				<p class="text-sm">PNG, JPG, WEBP jusqu'à 5 Mo</p>
			</div>
		{/if}

		<input
			accept="image/png, image/jpeg, image/webp"
			class="absolute h-full w-full opacity-0"
			{name}
			onchange={handleFileSelect}
			type="file"
		/>
	</label>

	<input type="hidden" name="{name}_initial_url" value={initialPreviewUrl} />
</div>
