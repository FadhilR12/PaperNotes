import type { Note } from './type.ts';
// import { note } from './data';
import PocketBase from 'pocketbase';

// export async function getAllNotes(): Promise<Note[]> {
// 	return note;
// }

export async function getAllNotes(pb: PocketBase): Promise<Note[]> {
	try {
		// Tambahkan sort agar catatan terbaru muncul di urutan pertama
		const records = await pb.collection('notes').getFullList({
			sort: '-created'
		});

		const notes = records.map((record) => ({
			id: record.id,
			title: record.title,
			desc: record.desc,
			created_at: record.created
		}));

		return notes;
	} catch (error) {
		console.error('Gagal mengambil data notes:', error);

		return [];
	}
}

export async function createNote(pb: PocketBase, form: Note) {
	try {
		const record = await pb.collection('notes').create({
			title: form.title,
			desc: form.desc
			// relation: pb.authStore.model?.id // Buka komentar ini nanti setelah fitur login selesai
		});
		return true;
	} catch (error) {
		console.error('Gagal membuat catatan baru:', error);
		return false;
	}
}

export async function deleteNote(pb: PocketBase, id: string) {
	try {
		await pb.collection('notes').delete(id);
		return true;
	} catch (error) {
		console.error(`Gagal menghapus catatan dengan ID ${id}:`, error);
		return false;
	}
}

export async function updateNote(pb: PocketBase, id: string, form: Note) {
	try {
		await pb.collection('notes').update(id, {
			title: form.title,
			desc: form.desc
			// relation: pb.authStore.model?.id // Buka komentar ini nanti setelah fitur login selesai
		});
	} catch (error) {
		console.error('Gagal memperbarui catatan:', error);
		return false;
	}
}
