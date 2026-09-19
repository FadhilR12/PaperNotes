import { createUser } from '$lib/repository/auth.js';
import type { User } from '$lib/repository/type.js';
import { userSchema } from '$lib/validation/user.js';
import type { Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	create: async ({ request, locals, cookies }) => {
		const formData = await request.formData();
		const submittedValues = Object.fromEntries(formData);
		const result = userSchema.safeParse(submittedValues);
		if (!result.success) {
			const firstNonTermsError = result.error.issues.find((e) => e.path[0] !== 'terms');
			return fail(400, {
				data: {
					name: submittedValues.name?.toString() || '',
					email: submittedValues.email?.toString() || ''
				},
				message: firstNonTermsError?.message,
				errors: result.error.flatten().fieldErrors
			});
		}
		const { name, email, password } = result.data;

		const newUser: User = {
			name,
			email,
			password,
			passwordConfirm: password
		};

		const isSuccess = await createUser(locals.pb, cookies, newUser);

		if (!isSuccess) {
			return fail(500, {
				data: { name, email },
				message: 'Failed to create an account. The email may already be in use.',
				errors: undefined
			});
		}
		throw redirect(303, '/');
	}
};
