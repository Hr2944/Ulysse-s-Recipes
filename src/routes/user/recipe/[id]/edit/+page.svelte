<script lang="ts">
	import type { PageProps } from './$types';
	import RecipeEditor from '$lib/client/user/RecipeEditor.svelte';

	let { data, form }: PageProps = $props();
</script>

<RecipeEditor editorMode="edit" errorMessage={form?.message} errorsListMessages={form?.errorsListMessages}
							recipe={data.recipe} />
