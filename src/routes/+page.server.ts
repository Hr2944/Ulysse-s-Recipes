import type { PageServerLoad } from './$types';
import { cachedAsync } from '$lib/server/cache';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const data = await cachedAsync('home-recipes-select', 43200, async () => {
		const s = performance.now()
		const { data } = await supabase
			.from('recipes')
			.select(
				'id, title, cover_image_url, difficulty, total_time_minutes, average_rating, is_vegetarian, is_vegan'
			)
			.eq('status', 'published')
			.order('created_at', { ascending: false })
			.limit(10);
		console.log(performance.now() - s);
		return data;
	});

	return {
		recipes: data?.map((r) => {
			return {
				...r,
				cover_image_url:
					r.cover_image_url === ''
						? ''
						: supabase.storage
								.from('recipe-images')
								.getPublicUrl(r.cover_image_url, { transform: { height: 300, width: 400 } }).data
								.publicUrl
			};
		})
	};
};
