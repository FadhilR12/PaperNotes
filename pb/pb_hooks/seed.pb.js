/// <reference path="../pb_data/types.d.ts" />

const fixture = {
	users: [
		{ key: '1', name: 'fadhil', email: 'fadhil@example.com', password: 'percobaan1' },
		{ key: '2', name: 'andrew', email: 'andrew@example.com', password: 'percobaan2' },
		{ key: '3', name: 'sarah', email: 'sarah@example.com', password: 'percobaan3' },
		{ key: '4', name: 'nabila', email: 'nabila@example.com', password: 'percobaan4' },
		{ key: '5', name: 'bima', email: 'bima@example.com', password: 'percobaan5' }
	],
	folders: [
		{ key: '1', name: 'Development', userKey: '1' },
		{ key: '2', name: 'Work', userKey: '2' },
		{ key: '3', name: 'Reading', userKey: '3' },
		{ key: '4', name: 'Ideas', userKey: '4' },
		{ key: '5', name: 'Personal', userKey: '5' }
	],
	tags: [
		{ key: '1', name: 'svelte', userKey: '1' },
		{ key: '2', name: 'meeting', userKey: '2' },
		{ key: '3', name: 'reading', userKey: '3' },
		{ key: '4', name: 'project', userKey: '4' },
		{ key: '5', name: 'shopping', userKey: '5' }
	],
	notes: [
		{
			key: '1',
			userKey: '1',
			folderKey: '1',
			title: 'Belajar SvelteKit',
			desc: 'Pelajari routing, load function, form actions, dan API endpoint di SvelteKit.',
			createdAt: 1757901600,
			versionTitle: 'Belajar SvelteKit',
			versionDesc: 'Pelajari routing dan form actions di SvelteKit.'
		},
		{
			key: '2',
			userKey: '2',
			folderKey: '2',
			title: 'Meeting',
			desc: 'Meeting dengan tim pada hari Jumat pukul 10:00.',
			createdAt: 1757948400,
			versionTitle: 'Meeting',
			versionDesc: 'Meeting tim hari Jumat.'
		},
		{
			key: '3',
			userKey: '3',
			folderKey: '3',
			title: 'Buku yang Ingin Dibaca',
			desc: 'Clean Code, The Pragmatic Programmer, dan Designing Data-Intensive Applications.',
			createdAt: 1757952000,
			versionTitle: 'Buku yang Ingin Dibaca',
			versionDesc: 'Clean Code dan The Pragmatic Programmer.'
		},
		{
			key: '4',
			userKey: '4',
			folderKey: '4',
			title: 'Ide Project',
			desc: 'Membuat aplikasi notes sederhana seperti Google Keep menggunakan SvelteKit.',
			createdAt: 1757944800,
			versionTitle: 'Ide Project',
			versionDesc: 'Membuat aplikasi notes sederhana.'
		},
		{
			key: '5',
			userKey: '5',
			folderKey: '5',
			title: 'Belanja Mingguan',
			desc: 'Beli susu, telur, roti, kopi, dan buah.',
			createdAt: 1757923200,
			versionTitle: 'Belanja Mingguan',
			versionDesc: 'Beli susu, telur, roti, dan buah.'
		}
	],
	noteTags: [
		{ noteKey: '1', tagKey: '1' },
		{ noteKey: '2', tagKey: '2' },
		{ noteKey: '3', tagKey: '3' },
		{ noteKey: '4', tagKey: '4' },
		{ noteKey: '5', tagKey: '5' }
	]
};

$app.rootCmd.addCommand(
	new Command({
		use: 'seed',
		short:
			'DESTRUCTIVE: replace all application records with inline demo fixtures; development/test only',
		run: () => {
			$app.runInTransaction((txApp) => {
				const collections = {
					noteVersions: txApp.findCollectionByNameOrId('note_versions'),
					noteTags: txApp.findCollectionByNameOrId('note_tags'),
					notes: txApp.findCollectionByNameOrId('notes'),
					folders: txApp.findCollectionByNameOrId('folders'),
					tags: txApp.findCollectionByNameOrId('tags'),
					users: txApp.findCollectionByNameOrId('users')
				};

				for (const collection of Object.values(collections)) {
					for (const record of txApp.findAllRecords(collection)) {
						txApp.delete(record);
					}
				}

				for (const user of fixture.users) {
					const record = new Record(collections.users);
					record.set('id', formatId('user', user.key));
					record.set('name', user.name);
					record.set('email', user.email);
					record.set('emailVisibility', true);
					record.set('verified', true);
					record.setPassword(user.password);
					txApp.save(record);
				}

				for (const folder of fixture.folders) {
					const record = new Record(collections.folders);
					record.set('id', formatId('folder', folder.key));
					record.set('name', folder.name);
					record.set('user', formatId('user', folder.userKey));
					txApp.save(record);
				}

				for (const tag of fixture.tags) {
					const record = new Record(collections.tags);
					record.set('id', formatId('tag', tag.key));
					record.set('name', tag.name);
					record.set('user', formatId('user', tag.userKey));
					txApp.save(record);
				}

				for (const note of fixture.notes) {
					const record = new Record(collections.notes);
					record.set('id', formatId('note', note.key));
					record.set('title', note.title);
					record.set('desc', note.desc);
					record.set('user', formatId('user', note.userKey));
					record.set('folder', formatId('folder', note.folderKey));
					record.setRaw('created', toPocketBaseDate(note.createdAt));
					txApp.save(record);
				}

				for (const [index, relation] of fixture.noteTags.entries()) {
					const record = new Record(collections.noteTags);
					record.set('id', formatId('notetag', String(index + 1)));
					record.set('note_id', formatId('note', relation.noteKey));
					record.set('tag_id', formatId('tag', relation.tagKey));
					txApp.save(record);
				}

				for (const note of fixture.notes) {
					const record = new Record(collections.noteVersions);
					record.set('id', formatId('version', note.key));
					record.set('note_id', formatId('note', note.key));
					record.set('title', note.versionTitle);
					record.set('desc', note.versionDesc);
					txApp.save(record);
				}
			});
		}
	})
);

function formatId(prefix, key) {
	return (prefix + key).padStart(15, '0').slice(0, 15);
}

function toPocketBaseDate(unixSeconds) {
	return new Date(unixSeconds * 1000).toISOString().replace('T', ' ');
}
