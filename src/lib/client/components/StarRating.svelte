<script lang="ts">
    let rating = $props(0);
    let maxRating = $props(5);
    let onRate = $props<(newRating: number) => void>();

    let hoverRating = $state(0);
</script>

<div class="flex items-center">
    {#each Array(maxRating) as _, i}
        {@const starValue = i + 1}
        <button
            on:mouseenter={() => hoverRating = starValue}
            on:mouseleave={() => hoverRating = 0}
            on:click={() => onRate(starValue)}
            class="text-2xl transition-colors"
            style:color={starValue <= (hoverRating || rating) ? 'var(--color-primart)' : '#ccc'}
        >
            ★
        </button>
    {/each}
</div>
