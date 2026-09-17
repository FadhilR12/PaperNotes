import { createUser } from '$lib/repository/auth.js';
import type { User } from '$lib/repository/type.js';
import type { Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();
		let name = (formData.get('name') as string)?.trim() || '';
		let email = (formData.get('email') as string)?.trim() || '';
		let password = (formData.get('password') as string)?.trim() || '';

		const newUser: User = {
			name: name,	
			email: email,
			password: password,
			passwordConfirm: password
		};

		const isSuccess = await createUser(locals.pb, newUser);

		if (!isSuccess) {
			return fail(500, {
				data: { name: name, email: email },
				message: 'Gagal membuat akun. Email mungkin sudah terpakai.'
			});
		}

		throw redirect(303, '/login');
	}
};
