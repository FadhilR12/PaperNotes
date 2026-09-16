// src/hooks.server.ts
import { createPocketBase } from '$lib/server/pocketbase.js';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const pb = createPocketBase();
	event.locals.pb = pb;

	return resolve(event);
};
