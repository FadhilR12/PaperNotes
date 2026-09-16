import { getAllNotes, createNote, deleteNote, updateNote } from '$lib/repository/storage.js';
import type { Note } from '$lib/repository/type.js';
import type { PageServerLoad, Actions } from './$types.js';

// export async function load() {
// 	return {
// 		note: await getAllNotes()
// 	};
// }

// src/routes/+page.server.ts

export const load: PageServerLoad = async ({ locals }) => {
	return {
		note: await getAllNotes(locals.pb)
	};
};

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
	},
	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		if (!id) {
			return { success: false, message: 'ID tidak ditemukan' };
		}
		const isSuccess = await deleteNote(locals.pb, id);

		if (!isSuccess) return { success: false, message: 'Gagal menghapus' };

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

		if (!isSuccess) return { success: false, message: 'Gagal mengupdate catatan' };

		return { success: true };
	}
};
