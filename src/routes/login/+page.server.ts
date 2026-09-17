// src/routes/login/+page.server.ts
import { error, fail, redirect } from '@sveltejs/kit';
import { login } from '$lib/repository/auth.js';
import type { Actions } from './$types.js';

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		const formData = await request.formData();

		const email = String(formData.get('email') ?? '');
		const password = String(formData.get('password') ?? '');

		const output = await login(locals.pb, cookies, {
			email: email,
			password: password
		});
		if (output.success) {
			redirect(303, '/');
		}

		if (output.reason == 'validation') {
			return fail(400, 'errors' in output ? { errors: output.errors } : {});
		}

		if (output.reason == 'internal_server_error') {
			error(500, output.message);
		}

		return fail(401, { email });
	}
};
