import { getAllNotes, createNote, deleteNote, updateNote } from '$lib/repository/storage.js';
import type { Note } from '$lib/repository/type.js';
import type { PageServerLoad, Actions } from './$types.js';

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();

		let title = (formData.get('title') as string)?.trim() || '';
		let desc = (formData.get('desc') as string)?.trim() || '';

		if (!title && !desc) {
			return { success: false };
		}

		if (!title) {
			title = 'Untitled note';
		}

		if (!desc) {
			desc = 'A thought captured just now.';
		}

		const isSuccess = await createNote(locals.pb, { title, desc } as Note);
		if (!isSuccess) return { success: false, message: 'Gagal menyimpan' };

		return { success: true };
	}
};
