<script lang="ts">
	import { inputId } from '$lib/client/inputs/input-id';

	let {
		value = $bindable(),
		rows = 1,
		name = undefined,
		label,
		id = undefined,
		...rest
	} = $props();

	const uniqueId = $derived(inputId(id, name));
</script>

<div class="relative group">
  <textarea
		{...rest}
		bind:value={value}
		class="peer w-full resize-none rounded-2xl border-2 border-transparent bg-surface px-4 pb-3 pt-7 text-base text-on-surface shadow-sm transition-all
           placeholder:text-transparent
           focus:border-primary/20 focus:bg-white focus:outline-none focus:shadow-md
           disabled:cursor-not-allowed disabled:opacity-50"
		id={uniqueId}
		{name}
		placeholder=" "
		rows={rows}
	></textarea>

	<label
		class="pointer-events-none absolute left-4 top-5 text-base text-on-surface/60 transition-all
           peer-focus:-translate-y-3 peer-focus:text-xs peer-focus:font-bold peer-focus:text-primary
           peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-bold"
		for={uniqueId}
	>
		{label}
	</label>
</div>
