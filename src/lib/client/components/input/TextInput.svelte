<script>
	let { value = $bindable(), type = "text", name = null, label } = $props();

	let id = $state(Math.random().toString());
</script>

<div class="group relative">
	<input bind:value={value}
				 class="peer w-full rounded-t-lg border-b-2 border-on-surface/30 bg-black/5 px-4 pb-2 pt-6 text-base text-on-surface transition placeholder:text-transparent focus:border-secondary focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200"
				 id={id} name={name} placeholder={label}
				 type={type} />
	<label
		class="pointer-events-none absolute left-4 top-5 text-base text-on-surface/60 transition-all group-focus-within:-translate-y-3 group-focus-within:text-xs group-focus-within:text-secondary peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:text-xs"
		for={id}>
		{label}
	</label>
</div>
