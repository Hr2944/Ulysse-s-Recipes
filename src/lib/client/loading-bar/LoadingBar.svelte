<script lang="ts">
  import { onDestroy } from 'svelte';

  let progress = $state(0);
  let opacity = $state(0);
  let interval: ReturnType<typeof setInterval>;

  export function start() {
    progress = 0;
    opacity = 1;

    clearInterval(interval);

    interval = setInterval(() => {
      const remaining = 1 - progress;
      if (remaining > 0.1) {
        progress += remaining * 0.1;
      }
    }, 100);
  }

  export function done() {
    clearInterval(interval);
    progress = 1;

    setTimeout(() => {
      opacity = 0;
      setTimeout(() => {
        progress = 0;
      }, 400);
    }, 100);
  }

  onDestroy(() => {
    if (typeof window !== 'undefined') clearInterval(interval);
  });
</script>

<div
  class="fixed top-0 left-0 z-100 h-1 w-full pointer-events-none transition-opacity duration-300"
  style="opacity: {opacity}"
>
  <div
    class="h-full bg-primary transition-all ease-out"
    style="
      width: {progress * 100}%;
      transition-duration: {progress === 1 ? '100ms' : '200ms'};
    "
  ></div>
</div>
