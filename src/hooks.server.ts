// src/hooks.server.ts
import { createPocketBase } from '$lib/server/pocketbase.js';
import { redirect, type Handle } from '@sveltejs/kit';
import { loadAuth, saveAuth, clearAuth } from '$lib/repository/auth.js';

export const handle: Handle = async ({ event, resolve }) => {
	const pb = createPocketBase();

	loadAuth(event.cookies, pb);

	event.locals.pb = pb;
	const path = event.url.pathname;
	const isDashboardRoute = path === '/';
	const isAuthRoute =
		path === '/login' || path === '/signup' || path === '/privacy' || path === '/terms';

	if (pb.authStore.isValid) {
		try {
			await pb.collection('users').authRefresh();
			saveAuth(event.cookies, pb);

			event.locals.user = pb.authStore.record;
		} catch {
			clearAuth(event.cookies, pb);
			event.locals.user = null;
		}
	}

	const isLoggedIn = pb.authStore.isValid;

	if (isDashboardRoute && !isLoggedIn) {
		throw redirect(303, '/login');
	}

	if (isAuthRoute && isLoggedIn) {
		throw redirect(303, '/');
	}

	return resolve(event);
};
