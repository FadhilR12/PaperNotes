import { getAllNotes, createNote, deleteNote, updateNote } from '$lib/repository/storage.js';
import type { Note } from '$lib/repository/type.js';
import type { PageServerLoad, Actions } from './$types.js';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		note: locals.user ? await getAllNotes(locals.pb, locals.user.id) : []
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		if (!locals.user) {
			return { success: false, message: 'Harap login terlebih dahulu' };
		}

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

		const isSuccess = await createNote(locals.pb, locals.user.id, { title, desc } as Note);

		if (!isSuccess.success) return { success: false, message: isSuccess.message };

		return { success: true };
	},

	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return { success: false, message: 'ID tidak ditemukan' };
		}

		const isSuccess = await deleteNote(locals.pb, id);

		if (!isSuccess.success) return { success: false, message: isSuccess.message };

		return { success: true };
	},

	update: async ({ request, locals }) => {
		const formData = await request.formData();

		const id = formData.get('id') as string;
		let title = (formData.get('title') as string)?.trim() || '';
		let desc = (formData.get('desc') as string)?.trim() || '';

		if (!id) return { success: false, message: 'ID tidak ditemukan' };
		if (!title && !desc) return { success: false, message: 'Catatan tidak boleh kosong' };

		if (!title) title = 'Untitled note';
		if (!desc) desc = 'A thought captured just now.';

		const isSuccess = await updateNote(locals.pb, id, { title, desc } as Note);

		if (!isSuccess.success) return { success: false, message: isSuccess.message };

		return { success: true };
	}
};
