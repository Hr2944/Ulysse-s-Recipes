import { redirect } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase, session } }) => {
	if (session) {
		redirect(303, '/user');
	}

	const code = url.searchParams.get('code');

	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			redirect(303, '/user');
		}
	}

	redirect(303, '/auth');
};
