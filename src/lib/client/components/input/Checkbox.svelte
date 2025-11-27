<script lang="ts">
	let { label, name = null, checked = $bindable(false), onchange = () => {} } = $props();

	let id = $state(Math.random().toString());
</script>

<label class="flex cursor-pointer items-center gap-3 text-base" for={id}>
	<span class="relative flex h-6 w-6 items-center justify-center">
			<input bind:checked={checked}
						 class="peer cursor-pointer h-full w-full shrink-0 appearance-none rounded-lg border-2 border-primary transition-all checked:border-0 checked:bg-primary checked:scale-105 active:scale-95 disabled:cursor-not-allowed"
						 id={id}
						 name={name}
						 type="checkbox"
						 placeholder={label}
						 onchange={onchange}
			/>
			<svg
				class="pointer-events-none absolute fill-white opacity-0 transition-opacity peer-checked:opacity-100"
				height="20" viewBox="0 -960 960 960" width="20"
				xmlns="http://www.w3.org/2000/svg">
					<path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
			</svg>
	</span>
	{label}
</label>
