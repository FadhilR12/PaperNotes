// src/routes/login/+page.server.ts
import { error, fail, redirect } from '@sveltejs/kit';
import { userLoginSchema } from '$lib/validation/user.js';
import { login } from '$lib/repository/auth.js';
import type { Actions } from './$types.js';

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		const formData = await request.formData();
		const submittedValues = Object.fromEntries(formData);
		const result = userLoginSchema.safeParse(submittedValues);
		if (!result.success) {
			return fail(400, {
				data: {
					email: submittedValues.email?.toString() || ''
				},
				message: result.error.issues[0]?.message,
				errors: result.error.flatten().fieldErrors
			});
		}
		const { email, password } = result.data;

		const output = await login(locals.pb, cookies, {
			email,
			password
		});
		if (output.success) {
			redirect(303, '/');
		}

		if (output.reason == 'internal_server_error') {
			return fail(500, {
				data: { email },
				message: output.message,
				errors: undefined
			});
		}

		return fail(401, {
			data: { email },
			message: 'Invalid email or password',
			errors: undefined
		});
	}
};
