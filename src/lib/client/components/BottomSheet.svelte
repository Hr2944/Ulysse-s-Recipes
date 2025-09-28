<script lang="ts">
    import { fly } from 'svelte/transition';

    let open = $state(false);
</script>

<div class="md:hidden fixed bottom-0 left-0 right-0 z-20">
    <button onclick={() => open = !open} class="w-full p-4 bg-primary text-white font-bold text-lg">
        Voir les ingrédients
    </button>
    {#if open}
        <div transition:fly={{ y: 200, duration: 300 }} 
             class="bg-white p-4 rounded-t-lg shadow-2xl max-h-[50vh] overflow-y-auto">
            <slot />
        </div>
    {/if}
</div>
