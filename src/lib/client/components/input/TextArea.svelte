<script lang="ts">
  let { value = $bindable(), rows = 1, name = null, label, maxHeight = 0 } = $props();
  let id = $state(Math.random().toString());

  let textareaEl: HTMLTextAreaElement | null = null;

  $effect(() => {
    const v = value; // Make value a dependency
    if (!textareaEl) return;

    textareaEl.style.height = "auto";
    const scroll = textareaEl.scrollHeight;

    if (maxHeight && maxHeight > 0) {
      const h = Math.min(scroll, maxHeight);
      textareaEl.style.height = `${h}px`;
      textareaEl.style.overflowY = scroll > maxHeight ? "auto" : "hidden";
    } else {
      textareaEl.style.height = `${scroll}px`;
      textareaEl.style.overflowY = "hidden";
    }
  });
</script>

<div class="group relative">
  <textarea
    bind:value={value}
    bind:this={textareaEl}
    class="peer w-full resize-none overflow-hidden rounded-t-lg border-b-2 border-on-surface/30 bg-black/5 px-4 pb-2 pt-6 text-base text-on-surface transition placeholder:text-transparent focus:border-primart focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200"
    id={id}
    name={name}
    placeholder={label}
    rows={rows}
  ></textarea>

  <label
    class="pointer-events-none absolute left-4 top-5 text-base text-on-surface/60 transition-all group-focus-within:-translate-y-3 group-focus-within:text-xs group-focus-within:text-primart peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:text-xs"
    for={id}
  >
    {label}
  </label>
</div>
