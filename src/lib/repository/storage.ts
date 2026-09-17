import type { Note } from './type.ts';
import PocketBase from 'pocketbase';

export async function getAllNotes(pb: PocketBase, userId: string): Promise<Note[]> {
	try {
		const records = await pb.collection('notes').getFullList({
			filter: `user = "${userId}"`,
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

export async function createNote(pb: PocketBase, userId: string, form: Note) {
	try {
		const record = await pb.collection('notes').create({
			title: form.title,
			desc: form.desc,
			user: userId
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
		});
		return true;
	} catch (error) {
		console.error('Gagal memperbarui catatan:', error);
		return false;
	}
}
