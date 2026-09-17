import { clearAuth } from '$lib/repository/auth.js';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types.js';

export const actions: Actions = {
	default: async ({ cookies, locals }) => {
		clearAuth(cookies, locals.pb);
		redirect(303, '/login');
	}
};
