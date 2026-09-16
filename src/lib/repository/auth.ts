import PocketBase from 'pocketbase';
import type { User } from './type.ts';

export async function createUser(pb: PocketBase, form: User) {
	try {
		await pb.collection('users').create({
			email: form.email,
			emailVisibility: true,
			name: form.name,
			password: form.password,
			passwordConfirm: form.passwordConfirm
		});
	} catch (error) {
		console.error('Gagal membuat user:', error);
		return false;
	}
}

// const body = {
//   "email": "test_980@example.com",
//   "emailVisibility": true,
//   "name": "example text",
//   "avatar": new File([...], 'test1.txt'),
//   "password": "123456789",
//   "passwordConfirm": "123456789"
// };

// const record = await pb.collection('users').create(body);
