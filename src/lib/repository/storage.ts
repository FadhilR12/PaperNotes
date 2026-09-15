import type { Note } from './type.ts';
import { note } from './data';

export async function getAllNotes(): Promise<Note[]> {
	return note;
}
