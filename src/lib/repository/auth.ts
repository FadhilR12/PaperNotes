import PocketBase, { ClientResponseError } from 'pocketbase';
import type { AuthenticateInput, User } from './type.ts';
import type { Cookies } from '@sveltejs/kit';
import { dev } from '$app/environment';

const AUTH_COOKIE = 'pb_auth';

export async function createUser(pb: PocketBase, cookies: Cookies, form: User) {
	try {
		await pb.collection('users').create({
			email: form.email,
			emailVisibility: true,
			name: form.name,
			password: form.password,
			passwordConfirm: form.passwordConfirm
		});
		await pb.collection('users').authWithPassword(form.email, form.password);
		saveAuth(cookies, pb);

		return true;
	} catch (error) {
		console.error('Gagal membuat user:', error);
		return false;
	}
}

export async function login(pb: PocketBase, cookies: Cookies, input: AuthenticateInput) {
	try {
		await pb.collection('users').authWithPassword(input.email, input.password);
		saveAuth(cookies, pb);
	} catch (error) {
		if (error instanceof ClientResponseError && error.status == 400) {
			return { success: false, reason: 'invalid_creds' };
		}

		const msg = (error as Error)?.message ?? '';
		return { success: false, reason: 'internal_server_error', message: msg };
	}

	return { success: true };
}

export function saveAuth(cookies: Cookies, pb: PocketBase): void {
	if (!pb.authStore.isValid || !pb.authStore.record) {
		clearAuth(cookies, pb);
		return;
	}

	cookies.set(
		AUTH_COOKIE,
		JSON.stringify({
			token: pb.authStore.token,
			record: pb.authStore.record
		}),
		{
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			maxAge: 7 * 86400
		}
	);
}

export function clearAuth(cookies: Cookies, pb: PocketBase): void {
	pb.authStore.clear();
	cookies.delete(AUTH_COOKIE, { path: '/' });
}

export function loadAuth(cookies: Cookies, pb: PocketBase): void {
	const storedAuth = cookies.get(AUTH_COOKIE);
	if (!storedAuth) {
		return;
	}

	try {
		const { token, record } = JSON.parse(storedAuth);
		pb.authStore.save(token, record);
	} catch {
		clearAuth(cookies, pb);
	}
}
