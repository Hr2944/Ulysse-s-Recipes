export type FilterValues = {
	q?: string;
	sort?: 'relevance' | 'newest' | 'rating' | 'time_asc';
	type?: 'all' | 'entrée' | 'plat' | 'dessert' | 'boisson';
	difficulty?: 'all' | 'facile' | 'moyen' | 'difficile';
	total_time?: 'all' | 'lt_30' | '30_60' | 'gt_60';
	status?: 'all' | 'published' | 'draft';
	is_vegetarian?: boolean;
	is_vegan?: boolean;
};
