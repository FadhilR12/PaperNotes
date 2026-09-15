import { getAllNotes } from '$lib/repository/storage.js';

export async function load() {
	return {
		note: await getAllNotes()
	};
}
