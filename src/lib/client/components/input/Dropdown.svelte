<script>
	let { value = $bindable(), name = null, label, children } = $props();

	let id = $state(Math.random().toString());
</script>

<div class="group relative">
	<select bind:value={value}
					class="peer w-full appearance-none rounded-t-lg border-b-2 border-on-surface/30 bg-black/5 px-4 pb-2 pt-6 text-base text-on-surface transition focus:border-primart focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200"
					{id} {name}>
		{@render children()}
	</select>
	<label
		class="pointer-events-none absolute left-4 top-3 text-xs text-on-surface/60 transition-all peer-invalid:top-5 peer-invalid:text-base group-focus-within:top-3 group-focus-within:text-xs group-focus-within:text-primart"
		for={id}>
		{label}
	</label>
</div>
