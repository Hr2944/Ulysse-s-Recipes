<script lang="ts">
  import RecipeEditor from '$lib/client/user/RecipeEditor.svelte';
  import type { PageProps } from './$types';
	import { INITIAL_RECIPE } from './defaults';

  let { form }: PageProps = $props();
</script>

<RecipeEditor
  editorMode="create"
  errorMessage={form?.message}
  errorsListMessages={form?.errorsListMessages}
  recipe={INITIAL_RECIPE}
/>
