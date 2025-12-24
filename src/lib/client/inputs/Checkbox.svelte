<script lang="ts">
	import { inputId } from '$lib/client/inputs/input-id';
	import { check } from '$lib/assets/svg-paths';

	let {
		label,
		name = undefined,
		checked = $bindable(false),
		id = undefined,
		...rest
	} = $props();

	const uniqueId = $derived(inputId(id, name));
</script>

<label
	class="group flex cursor-pointer items-center gap-3 text-base select-none"
	for={uniqueId}
>
  <span class="relative flex h-6 w-6 shrink-0 items-center justify-center">
    <input
			{...rest}
			bind:checked={checked}
			class="peer h-full w-full cursor-pointer appearance-none rounded-lg border-2 border-primary transition-all
             checked:border-0 checked:bg-primary checked:scale-105
             active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
			id={uniqueId}
			{name}
			type="checkbox"
		/>

    <svg
			class="pointer-events-none absolute h-5 w-5 fill-white opacity-0 transition-opacity peer-checked:opacity-100"
			viewBox="0 -960 960 960">
      <path d={check} />
    </svg>
  </span>

	<span class="text-on-surface">{label}</span>
</label>
