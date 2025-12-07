<script lang="ts">
	import type { PageProps } from './$types';
	import RecipeEditor from '$lib/client/components/user/RecipeEditor.svelte';

	let { data, form }: PageProps = $props();
</script>

<RecipeEditor editorMode="edit" errorsListMessages={form?.errorsListMessages} errorMessage={form?.message} recipe={data.recipe}></RecipeEditor>
