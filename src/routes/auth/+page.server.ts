import { fail } from '@sveltejs/kit';

import type { Actions } from './$types';

export const actions = {
	signup: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const username = formData.get('username');

		if (!email || !username) {
			return fail(400);
		}

		const { error } = await supabase.auth.signInWithOtp({
			email: email as string,
			options: {
				shouldCreateUser: true,
				emailRedirectTo: url.origin + '/auth/callback',
				data: { display_name: username }
			}
		});

		return { success: error === null };
	},

	login: async ({ request, url, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email');

		if (!email) {
			return fail(400);
		}

		const { error } = await supabase.auth.signInWithOtp({
			email: email as string,
			options: {
				shouldCreateUser: false,
				emailRedirectTo: url.origin + '/auth/callback',
			}
		});

		return { success: error === null };
	}
} satisfies Actions;
