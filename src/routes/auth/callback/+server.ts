import { error, redirect } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase, session } }) => {
	if (session) {
		redirect(303, '/user');
	}

	const code = url.searchParams.get('code');

	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		console.log(error);
		if (!error) {
			redirect(303, '/user');
		}
	}

	error(500);
};
