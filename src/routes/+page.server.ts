import {
	createFolder as saveFolder,
	createNote as saveNote,
	createTag as saveTag,
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

function parseQuickCommand(value: string, folders: { id: string; name: string }[]) {
	if (!value.startsWith('/')) return null;
	const commandPattern = /\/(folder|newFolder|tags)\b/gi;
	const matches = [...value.matchAll(commandPattern)];
	if (!matches.length || matches[0].index !== 0) return null;

	let folderName: string | null = null;
	let targetFolderId: string | null = null;
	const tagNames: string[] = [];
	const contents: string[] = [];

	for (const [index, match] of matches.entries()) {
		const commandStart = match.index ?? 0;
		const start = commandStart + match[0].length;
		const end = matches[index + 1]?.index ?? value.length;
		const argument = value.slice(start, end).trim();
		const type = match[1].toLowerCase();

		if (type === 'folder') {
			const folder = [...folders]
				.sort((left, right) => right.name.length - left.name.length)
				.find((candidate) => {
					const prefix = argument.slice(0, candidate.name.length);
					return (
						prefix.toLowerCase() === candidate.name.toLowerCase() &&
						(argument.length === candidate.name.length ||
							/\s/.test(argument[candidate.name.length]))
					);
				});
			if (!folder) {
				contents.push(value.slice(commandStart, end).trim());
				continue;
			}
			if (folderName || targetFolderId) {
				throw new Error('Gunakan satu command folder untuk setiap catatan.');
			}
			targetFolderId = folder.id;
			const content = argument.slice(folder.name.length).trim();
			if (content) contents.push(content);
			continue;
		}

		const separator = argument.search(/\s/);
		const name = separator === -1 ? argument : argument.slice(0, separator);
		const content = separator === -1 ? '' : argument.slice(separator).trim();

		if (!name) {
			throw new Error(
				type === 'tags'
					? 'Gunakan format /tags <nama-tag> [isi catatan].'
					: 'Gunakan format /newFolder <nama-folder> [isi catatan].'
			);
		}

		if (type === 'tags') {
			tagNames.push(name);
		} else {
			if (folderName || targetFolderId) {
				throw new Error('Gunakan satu command folder untuk setiap catatan.');
			}
			folderName = name;
		}
		if (content) contents.push(content);
	}

	if (!folderName && !targetFolderId && !tagNames.length) return null;
	return { folderName, targetFolderId, tagNames, content: contents.join('\n') };
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
		let command: ReturnType<typeof parseQuickCommand> = null;
		try {
			const folders =
				desc.startsWith('/') && /\/folder\b/i.test(desc)
					? await locals.pb.collection('folders').getFullList<{ id: string; name: string }>({
							filter: locals.pb.filter('user = {:userId}', { userId: locals.user.id })
						})
					: [];
			command = parseQuickCommand(desc, folders);
		} catch (error) {
			return { success: false, message: messageFor(error) };
		}

		if (command) {
			try {
				let folderId = command.targetFolderId ?? formValue(formData, 'folder');
				let tagInput = formValue(formData, 'tags');
				if (command.folderName) {
					const folder = await saveFolder(locals.pb, locals.user.id, command.folderName);
					folderId = folder.id;
				}
				for (const name of command.tagNames) {
					const tag = await saveTag(locals.pb, locals.user.id, name);
					tagInput = [tagInput, tag.name].filter(Boolean).join(', ');
				}

				if (!command.content) return { success: true, command: true };
				if (!title) title = 'Untitled note';
				desc = command.content;
				await saveNote(locals.pb, locals.user.id, { title, desc }, folderId, tagInput);
				return { success: true, command: true };
			} catch (error) {
				return { success: false, message: messageFor(error) };
			}
		}

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
