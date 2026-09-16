/// <reference path="../pb_data/types.d.ts" />

$app.rootCmd.addCommand(
	new Command({
		use: 'seed',
		short:
			'seed data from pb_hooks/data_ori.json if records already exists they will be deleted first before re-inserted',
		run: () => {
			// Membaca file data_ori.json dari folder pb_hooks
			const data = JSON.parse(toString($os.readFile(`${__hooks}/data_ori.json`)));
			const usersCol = $app.findCollectionByNameOrId('users');
			const notesCol = $app.findCollectionByNameOrId('notes');

			$app.runInTransaction((txApp) => {
				const deleteIfExists = (colId, filterStr, params) => {
					try {
						const rec = txApp.findFirstRecordByFilter(colId, filterStr, params);
						txApp.delete(rec);
					} catch {
						// there is no record, so do nothing
					}
				};

				// Fungsi bantuan untuk membuat ID persis 15 karakter (syarat wajib PocketBase)
				// Contoh: formatId("user", "1") -> "0000000000user1"
				const formatId = (prefix, id) => {
					return (prefix + id).padStart(15, '0').slice(0, 15);
				};

				// 1. Iterate users records
				for (const user of data['user']) {
					const pbUserId = formatId('user', user['user_id']);

					deleteIfExists(usersCol.id, 'id = {:id}', { id: pbUserId });

					const record = new Record(usersCol);
					record.set('id', pbUserId);
					record.set('name', user['username']);
					record.set('email', user['email']);
					record.set('emailVisibility', true);
					record.set('verified', true);

					// PENTING: Gunakan setPassword untuk koleksi Auth agar di-hash otomatis
					record.setPassword(user['password']);

					txApp.save(record);
				}

				// 2. Iterate notes records
				for (const note of data['note']) {
					const pbNoteId = formatId('note', note['note_id']);
					const relationUserId = formatId('user', note['user_id']);

					deleteIfExists(notesCol.id, 'id = {:id}', { id: pbNoteId });

					const record = new Record(notesCol);
					record.set('id', pbNoteId);
					record.set('title', note['title']);
					record.set('desc', note['desc']);

					// Menghubungkan relasi menggunakan ID user yang sudah di-format 15 karakter
					record.set('relation', relationUserId);

					if (note['created_at']) {
						record.setRaw('created', toPocketBaseDate(note['created_at']));
					}

					txApp.save(record);
				}
			});

			console.log(`Seed complete!`);
		}
	})
);

function toPocketBaseDate(unixSeconds) {
	if (!unixSeconds) {
		return null;
	}
	// Konversi Unix timestamp ke format string yang diterima PocketBase
	return new Date(unixSeconds * 1000).toISOString().replace('T', ' ');
}
