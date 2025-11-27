<script>
	let { value = $bindable(), type = "text", name = null, label } = $props();

	let id = $state(Math.random().toString());

</script>

<div class="group relative">
	<input bind:value={value}
				 class="peer w-full rounded-2xl border-2 border-transparent bg-surface px-4 pb-3 pt-7 text-base text-on-surface shadow-sm transition-all placeholder:text-transparent focus:border-primary/20 focus:bg-white focus:outline-none focus:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
				 id={id} name={name} placeholder={label}
				 type={type} />
	<label
		class="pointer-events-none absolute left-4 top-5 text-base text-on-surface/60 transition-all group-focus-within:-translate-y-3 group-focus-within:text-xs group-focus-within:font-bold group-focus-within:text-primary peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-bold"
		for={id}>
		{label}
	</label>
</div>
