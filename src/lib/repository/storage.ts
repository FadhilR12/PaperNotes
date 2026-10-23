import PocketBase from 'pocketbase';
import type { Folder, Note, NoteVersion, Tag } from './type.js';

type NoteRecord = {
	id: string;
	user: string;
	folder: string;
	title: string;
	desc: string;
	created: string;
	updated: string;
};

type FolderRecord = {
	id: string;
	user: string;
	name: string;
	created: string;
	updated: string;
};

type TagRecord = {
	id: string;
	name: string;
};

type NoteTagRecord = {
	id: string;
	note_id: string;
	tag_id: string;
};

type NoteVersionRecord = {
	id: string;
	note_id: string;
	title: string;
	desc: string;
	created: string;
};

function ownerFilter(pb: PocketBase, userId: string): string {
	return pb.filter('user = {:userId}', { userId });
}

export async function getDashboardData(
	pb: PocketBase,
	userId: string
): Promise<{ notes: Note[]; folders: Folder[]; tags: Tag[] }> {
	const [noteRecords, folderRecords, tagRecords] = await Promise.all([
		pb.collection('notes').getFullList<NoteRecord>({
			filter: ownerFilter(pb, userId),
			sort: '-created'
		}),
		pb.collection('folders').getFullList<FolderRecord>({
			filter: ownerFilter(pb, userId),
			sort: 'name'
		}),
		pb.collection('tags').getFullList<TagRecord>({
			filter: ownerFilter(pb, userId),
			sort: 'name'
		})
	]);

	const noteIds = new Set(noteRecords.map((note) => note.id));
	const tagById = new Map(tagRecords.map((tag) => [tag.id, tag]));
	const noteTags = noteRecords.length
		? await pb.collection('note_tags').getFullList<NoteTagRecord>({
				filter: pb.filter('note_id.user = {:userId}', { userId })
			})
		: [];
	const tagsByNote = new Map<string, Tag[]>();

	for (const relation of noteTags) {
		if (!noteIds.has(relation.note_id)) continue;
		const tag = tagById.get(relation.tag_id);
		if (!tag) continue;

		const noteTagList = tagsByNote.get(relation.note_id) ?? [];
		noteTagList.push({ id: tag.id, name: tag.name });
		tagsByNote.set(relation.note_id, noteTagList);
	}

	return {
		notes: noteRecords.map((note) => ({
			id: note.id,
			title: note.title,
			desc: note.desc,
			created_at: note.created,
			folder_id: note.folder ?? '',
			tags: tagsByNote.get(note.id) ?? []
		})),
		folders: folderRecords.map((folder) => ({
			id: folder.id,
			name: folder.name,
			created_at: folder.created
		})),
		tags: tagRecords.map((tag) => ({ id: tag.id, name: tag.name }))
	};
}

function parseTagNames(value: string): string[] {
	const names = value
		.split(',')
		.map((name) => name.trim().toLowerCase())
		.filter(Boolean);

	if (names.length > 10 || names.some((name) => name.length > 50)) {
		throw new Error('Gunakan maksimal 10 tag, masing-masing maksimal 50 karakter.');
	}

	return [...new Set(names)];
}

async function synchronizeNoteTags(
	pb: PocketBase,
	userId: string,
	noteId: string,
	names: string[]
): Promise<void> {
	const [tagRecords, relations] = await Promise.all([
		pb.collection('tags').getFullList<TagRecord>({
			filter: ownerFilter(pb, userId)
		}),
		pb.collection('note_tags').getFullList<NoteTagRecord>({
			filter: pb.filter('note_id = {:noteId}', { noteId })
		})
	]);

	const tagsByName = new Map(tagRecords.map((tag) => [tag.name, tag]));
	const existingTagIds = new Set(relations.map((relation) => relation.tag_id));
	const desiredTags: TagRecord[] = [];

	for (const name of names) {
		let tag = tagsByName.get(name);
		if (!tag) {
			tag = await pb.collection('tags').create<TagRecord>({ name, user: userId });
			tagsByName.set(name, tag);
		}
		desiredTags.push(tag);
	}

	const desiredTagIds = new Set(desiredTags.map((tag) => tag.id));
	for (const tag of desiredTags) {
		if (existingTagIds.has(tag.id)) continue;
		await pb.collection('note_tags').create({
			note_id: noteId,
			tag_id: tag.id
		});
	}

	const removedTagIds = new Set<string>();
	for (const relation of relations) {
		if (!desiredTagIds.has(relation.tag_id)) {
			await pb.collection('note_tags').delete(relation.id);
			removedTagIds.add(relation.tag_id);
		}
	}

	for (const tagId of removedTagIds) {
		const remaining = await pb.collection('note_tags').getList(1, 1, {
			filter: pb.filter('tag_id = {:tagId}', { tagId })
		});
		if (remaining.totalItems === 0) {
			await pb.collection('tags').delete(tagId);
		}
	}
}

export async function createNote(
	pb: PocketBase,
	userId: string,
	form: Pick<Note, 'title' | 'desc'>,
	folderId: string,
	tagInput: string
): Promise<void> {
	const tagNames = parseTagNames(tagInput);
	const folder = folderId ? await pb.collection('folders').getOne<FolderRecord>(folderId) : null;

	const record = await pb.collection('notes').create<NoteRecord>({
		title: form.title,
		desc: form.desc,
		user: userId,
		folder: folder?.id ?? ''
	});

	await synchronizeNoteTags(pb, userId, record.id, tagNames);
}

export async function updateNote(
	pb: PocketBase,
	userId: string,
	id: string,
	form: Pick<Note, 'title' | 'desc'>,
	folderId: string,
	tagInput: string
): Promise<void> {
	const tagNames = parseTagNames(tagInput);
	const existing = await pb.collection('notes').getOne<NoteRecord>(id);
	if (existing.user !== userId) throw new Error('Catatan tidak ditemukan.');

	const folder = folderId ? await pb.collection('folders').getOne<FolderRecord>(folderId) : null;
	if (folder && folder.user !== userId) throw new Error('Folder tidak ditemukan.');

	const changed = existing.title !== form.title || existing.desc !== form.desc;
	await pb.collection('notes').update(id, {
		title: form.title,
		desc: form.desc,
		folder: folder?.id ?? ''
	});

	if (changed) {
		await pb.collection('note_versions').create({
			note_id: id,
			title: existing.title,
			desc: existing.desc
		});

		const versions = await pb.collection('note_versions').getFullList<NoteVersionRecord>({
			filter: pb.filter('note_id = {:noteId}', { noteId: id }),
			sort: '-created,-id'
		});
		for (const version of versions.slice(3)) {
			await pb.collection('note_versions').delete(version.id);
		}
	}

	await synchronizeNoteTags(pb, userId, id, tagNames);
}

export async function deleteNote(pb: PocketBase, id: string): Promise<void> {
	await pb.collection('notes').delete(id);
}

export async function createFolder(
	pb: PocketBase,
	userId: string,
	name: string
): Promise<FolderRecord> {
	const folders = await pb.collection('folders').getFullList<FolderRecord>({
		filter: ownerFilter(pb, userId)
	});
	const existingNames = new Set(folders.map((folder) => folder.name));
	let uniqueName = name;
	let suffix = 2;
	while (existingNames.has(uniqueName)) {
		uniqueName = `${name} (${suffix})`;
		suffix += 1;
	}

	return pb.collection('folders').create<FolderRecord>({ name: uniqueName, user: userId });
}

export async function createTag(pb: PocketBase, userId: string, name: string): Promise<TagRecord> {
	const normalizedName = name.trim().toLowerCase();
	if (!normalizedName || normalizedName.length > 50) {
		throw new Error('Nama tag wajib diisi dan maksimal 50 karakter.');
	}

	const tags = await pb.collection('tags').getFullList<TagRecord>({
		filter: ownerFilter(pb, userId)
	});
	const existing = tags.find((tag) => tag.name.toLowerCase() === normalizedName);
	if (existing) return existing;

	return pb.collection('tags').create<TagRecord>({ name: normalizedName, user: userId });
}

export async function renameFolder(
	pb: PocketBase,
	userId: string,
	id: string,
	name: string
): Promise<void> {
	const folder = await pb.collection('folders').getOne<FolderRecord>(id);
	if (folder.user !== userId) throw new Error('Folder tidak ditemukan.');
	await pb.collection('folders').update(id, { name });
}

export async function deleteFolder(pb: PocketBase, userId: string, id: string): Promise<void> {
	const folder = await pb.collection('folders').getOne<FolderRecord>(id);
	if (folder.user !== userId) throw new Error('Folder tidak ditemukan.');

	const notes = await pb.collection('notes').getFullList<NoteRecord>({
		filter: pb.filter('user = {:userId} && folder = {:folderId}', { userId, folderId: id })
	});
	for (const note of notes) {
		await pb.collection('notes').update(note.id, { folder: '' });
	}
	await pb.collection('folders').delete(id);
}

export async function getNoteHistory(
	pb: PocketBase,
	userId: string,
	noteId: string
): Promise<NoteVersion[]> {
	const note = await pb.collection('notes').getOne<NoteRecord>(noteId);
	if (note.user !== userId) throw new Error('Catatan tidak ditemukan.');

	const versions = await pb.collection('note_versions').getList<NoteVersionRecord>(1, 3, {
		filter: pb.filter('note_id = {:noteId}', { noteId }),
		sort: '-created,-id'
	});

	return versions.items.map((version) => ({
		id: version.id,
		title: version.title,
		desc: version.desc,
		created_at: version.created
	}));
}

export async function restoreNoteVersion(
	pb: PocketBase,
	userId: string,
	noteId: string,
	versionId: string,
	folderId: string,
	tagInput: string
): Promise<void> {
	const version = await pb.collection('note_versions').getOne<NoteVersionRecord>(versionId);
	if (version.note_id !== noteId) throw new Error('Versi catatan tidak ditemukan.');

	await updateNote(
		pb,
		userId,
		noteId,
		{ title: version.title, desc: version.desc },
		folderId,
		tagInput
	);
}
