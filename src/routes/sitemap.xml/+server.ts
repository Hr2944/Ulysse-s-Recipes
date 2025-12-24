import type { RequestHandler } from './$types';

const SITE_URL = 'https://ulysse-s-recipes.vercel.app';

const staticPages = [
	{ path: '/', changefreq: 'daily', priority: 1.0 },
	{ path: '/search', changefreq: 'daily', priority: 0.8 },
	{ path: '/auth', changefreq: 'monthly', priority: 0.1 }
];

export const GET: RequestHandler = async ({ locals: { supabase } }) => {
	const { data: recipes } = await supabase
		.from('recipes')
		.select('id, updated_at')
		.eq('status', 'published');

	// 3. Construct the XML string
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
		.map(
			(page) => `
  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
		)
		.join('')}

  ${
		recipes
			? recipes
					.map(
						(recipe) => `
  <url>
    <loc>${SITE_URL}/recipe/${recipe.id}</loc>
    <lastmod>${new Date(recipe.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
					)
					.join('')
			: ''
	}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			// Cache on CDN/Browser for 5 hours to reduce DB load
			'Cache-Control': 'max-age=0, s-maxage=18000'
		}
	});
};
