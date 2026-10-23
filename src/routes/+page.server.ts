import {
	createFolder as saveFolder,
	createNote as saveNote,
	deleteFolder as removeFolder,
	deleteNote as removeNote,
	getDashboardData,
	getNoteHistory,
	renameFolder as updateFolder,
	restoreNoteVersion,
	updateNote as saveNoteChanges
} from '$lib/repository/storage.js';
import type { Actions, PageServerLoad } from './$types.js';

function messageFor(error: unknown): string {
	console.error('PaperNotes action failed:', error);
	if (error instanceof Error && error.message) return error.message;
	return 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.';
}

function formValue(formData: FormData, key: string): string {
	const value = formData.get(key);
	return typeof value === 'string' ? value.trim() : '';
}

export const load: PageServerLoad = async ({ locals }) => {
	const dashboard = locals.user
		? await getDashboardData(locals.pb, locals.user.id)
		: { notes: [], folders: [], tags: [] };
	return {
		note: dashboard.notes,
		folders: dashboard.folders,
		tags: dashboard.tags
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		if (!locals.user) return { success: false, message: 'Harap login terlebih dahulu.' };

		const formData = await request.formData();
		let title = formValue(formData, 'title');
		let desc = formValue(formData, 'desc');
		if (!title && !desc) return { success: false, message: 'Catatan tidak boleh kosong.' };
		if (!title) title = 'Untitled note';
		if (!desc) desc = 'A thought captured just now.';

		try {
			await saveNote(
				locals.pb,
				locals.user.id,
				{ title, desc },
				formValue(formData, 'folder'),
				formValue(formData, 'tags')
			);
			return { success: true };
		} catch (error) {
			return { success: false, message: messageFor(error) };
		}
	},

	update: async ({ request, locals }) => {
		if (!locals.user) return { success: false, message: 'Harap login terlebih dahulu.' };

		const formData = await request.formData();
		const id = formValue(formData, 'id');
		let title = formValue(formData, 'title');
		let desc = formValue(formData, 'desc');
		if (!id) return { success: false, message: 'ID catatan tidak ditemukan.' };
		if (!title && !desc) return { success: false, message: 'Catatan tidak boleh kosong.' };
		if (!title) title = 'Untitled note';
		if (!desc) desc = 'A thought captured just now.';

		try {
			await saveNoteChanges(
				locals.pb,
				locals.user.id,
				id,
				{ title, desc },
				formValue(formData, 'folder'),
				formValue(formData, 'tags')
			);
			return { success: true };
		} catch (error) {
			return { success: false, message: messageFor(error) };
		}
	},

	delete: async ({ request, locals }) => {
		if (!locals.user) return { success: false, message: 'Harap login terlebih dahulu.' };
		const id = formValue(await request.formData(), 'id');
		if (!id) return { success: false, message: 'ID catatan tidak ditemukan.' };

		try {
			await removeNote(locals.pb, id);
			return { success: true };
		} catch (error) {
			return { success: false, message: messageFor(error) };
		}
	},

	createFolder: async ({ request, locals }) => {
		if (!locals.user) return { success: false, message: 'Harap login terlebih dahulu.' };
		const name = formValue(await request.formData(), 'name');
		if (!name || name.length > 100) {
			return { success: false, message: 'Nama folder wajib diisi dan maksimal 100 karakter.' };
		}

		try {
			const folder = await saveFolder(locals.pb, locals.user.id, name);
			return { success: true, folderId: folder.id };
		} catch (error) {
			return { success: false, message: messageFor(error) };
		}
	},

	renameFolder: async ({ request, locals }) => {
		if (!locals.user) return { success: false, message: 'Harap login terlebih dahulu.' };
		const formData = await request.formData();
		const id = formValue(formData, 'id');
		const name = formValue(formData, 'name');
		if (!id || !name || name.length > 100) {
			return { success: false, message: 'Nama folder wajib diisi dan maksimal 100 karakter.' };
		}

		try {
			await updateFolder(locals.pb, locals.user.id, id, name);
			return { success: true };
		} catch (error) {
			return { success: false, message: messageFor(error) };
		}
	},

	deleteFolder: async ({ request, locals }) => {
		if (!locals.user) return { success: false, message: 'Harap login terlebih dahulu.' };
		const id = formValue(await request.formData(), 'id');
		if (!id) return { success: false, message: 'ID folder tidak ditemukan.' };

		try {
			await removeFolder(locals.pb, locals.user.id, id);
			return { success: true };
		} catch (error) {
			return { success: false, message: messageFor(error) };
		}
	},

	history: async ({ request, locals }) => {
		if (!locals.user) return { success: false, message: 'Harap login terlebih dahulu.' };
		const noteId = formValue(await request.formData(), 'id');
		if (!noteId) return { success: false, message: 'ID catatan tidak ditemukan.' };

		try {
			return { success: true, versions: await getNoteHistory(locals.pb, locals.user.id, noteId) };
		} catch (error) {
			return { success: false, message: messageFor(error) };
		}
	},

	restoreVersion: async ({ request, locals }) => {
		if (!locals.user) return { success: false, message: 'Harap login terlebih dahulu.' };
		const formData = await request.formData();
		const noteId = formValue(formData, 'id');
		const versionId = formValue(formData, 'versionId');
		if (!noteId || !versionId) {
			return { success: false, message: 'Versi catatan tidak ditemukan.' };
		}

		try {
			await restoreNoteVersion(
				locals.pb,
				locals.user.id,
				noteId,
				versionId,
				formValue(formData, 'folder'),
				formValue(formData, 'tags')
			);
			return { success: true };
		} catch (error) {
			return { success: false, message: messageFor(error) };
		}
	}
};
