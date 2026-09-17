import { clearAuth } from '$lib/repository/auth.js';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types.js';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	clearAuth(cookies, locals.pb);
	redirect(303, '/login');
};
