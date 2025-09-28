<script lang="ts">
    let { servings, baseServings, ingredients } = $props();

    const adjustedIngredients = $derived(
        ingredients.map(item => ({
            ...item,
            quantity: (item.quantity / baseServings) * servings
        }))
    );
</script>

<div class="flex items-center gap-4 mb-4">
    <label for="servings">Pour</label>
    <input type="number" id="servings" bind:value={servings} min="1" class="w-20 p-2 border rounded" />
    <span>personnes</span>
</div>
<ul class="space-y-2">
    {#each adjustedIngredients as item}
        <li class="flex gap-2">
            <span class="font-bold text-primary">{item.quantity.toFixed(1)}</span>
            <span>{item.ingredient.unit || ''}</span>
            <span>{item.ingredient.name}</span>
        </li>
    {/each}
</ul>
