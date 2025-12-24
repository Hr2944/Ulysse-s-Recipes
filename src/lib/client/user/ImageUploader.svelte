<script lang="ts">
	import { upload_file, upload_image } from '$lib/assets/svg-paths';

	type Props = {
		name: string;
		initialPreviewUrl?: string | null;
	};

	let { name, initialPreviewUrl = null }: Props = $props();

	let previewUrl = $state<string | null>(initialPreviewUrl);

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) return;

		// Validation
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
		class="relative flex h-64 w-full cursor-pointer items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-primary/50 bg-primary/5 text-center transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:shadow-lg"
	>
		{#if previewUrl}
			<img
				src={previewUrl}
				alt="Aperçu"
				class="h-full w-full object-cover"
				decoding="async"
			/>

			<div
				class="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white opacity-0 transition-opacity hover:opacity-100">
				<svg height="48" viewBox="0 -960 960 960" width="48" fill="currentColor">
					<path
						d={upload_image} />
				</svg>
				<p class="mt-2 font-bold">Changer l'image</p>
			</div>

		{:else}
			<div class="flex flex-col items-center text-on-surface/70">
				<svg class="h-12 w-12 fill-current opacity-50" viewBox="0 -960 960 960">
					<path
						d={upload_image} />
				</svg>
				<p class="mt-4 font-semibold">Cliquez ou glissez une image ici</p>
				<p class="text-sm">PNG, JPG, WEBP jusqu'à 5 Mo</p>
			</div>
		{/if}

		<input
			accept="image/png, image/jpeg, image/webp"
			class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
			{name}
			onchange={handleFileSelect}
			type="file"
		/>
	</label>

	<input name="{name}_initial_url" type="hidden" value={initialPreviewUrl} />
</div>
