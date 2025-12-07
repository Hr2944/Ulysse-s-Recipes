<script lang="ts">
	import RecipeEditor from '$lib/client/components/user/RecipeEditor.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();

	const recipe = {
		title: null,
		type: null,
		cook_time_minutes: null,
		cost: null,
		cover_image_url: null,
		created_at: null,
		description: null,
		difficulty: null,
		is_vegan: null,
		is_vegetarian: null,
		prep_time_minutes: null,
		servings: null,
		status: null,
		ingredients: [],
		steps: []
	};
</script>

<RecipeEditor editorMode="create" errorMessage={form?.message} errorsListMessages={form?.errorsListMessages}
							recipe={recipe}></RecipeEditor>
