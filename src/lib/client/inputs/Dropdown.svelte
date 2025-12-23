<script lang="ts">
  import { inputId } from '$lib/client/inputs/input-id';

  let {
    value = $bindable(),
    name = undefined,
    label,
    children,
    id = undefined,
    ...rest
  } = $props();

  const uniqueId = $derived(inputId(id, name));
</script>

<div class="relative group">
  <select
    bind:value={value}
    id={uniqueId}
    {name}
    class="peer w-full appearance-none rounded-2xl border-2 border-transparent bg-surface px-4 pb-3 pt-7 text-base text-on-surface shadow-sm transition-all
           focus:border-primary/20 focus:bg-white focus:outline-none focus:shadow-md
           disabled:cursor-not-allowed disabled:opacity-50"
    {...rest}
  >
   {@render children()}
  </select>

  <label
   class="pointer-events-none absolute left-4 top-3 text-xs font-bold text-on-surface/60 transition-all
          peer-invalid:top-5 peer-invalid:text-base peer-invalid:font-normal
          peer-focus:top-3 peer-focus:text-xs peer-focus:font-bold peer-focus:text-primary"
   for={uniqueId}>
   {label}
  </label>

  <div class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface/50 peer-focus:text-primary">
   <svg height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
    <path d="M480-360 280-560h400L480-360Z"/>
   </svg>
  </div>
</div>
