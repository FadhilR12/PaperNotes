/// <reference path="../pb_data/types.d.ts" />
migrate(
	(app) => {
		const idField = (id) => ({
			id,
			name: 'id',
			type: 'text',
			required: true,
			primaryKey: true,
			system: true,
			min: 15,
			max: 15,
			pattern: '^[a-z0-9]+$',
			autogeneratePattern: '[a-z0-9]{15}'
		});

		const relationField = (id, name, collectionId, required, cascadeDelete) => ({
			id,
			name,
			type: 'relation',
			collectionId,
			required,
			cascadeDelete,
			minSelect: required ? 1 : 0,
			maxSelect: 1,
			system: false
		});

		const timestampFields = (prefix) => [
			{
				id: `autodate${prefix}1`,
				name: 'created',
				type: 'autodate',
				onCreate: true,
				onUpdate: false,
				system: false
			},
			{
				id: `autodate${prefix}2`,
				name: 'updated',
				type: 'autodate',
				onCreate: true,
				onUpdate: true,
				system: false
			}
		];

		const saveOwnedCollection = (name, id, fields, indexes, rules) => {
			const collection = new Collection({
				id,
				type: 'base',
				name,
				fields,
				indexes: [],
				listRule: null,
				viewRule: null,
				createRule: null,
				updateRule: null,
				deleteRule: null
			});
			app.save(collection);
			collection.indexes = indexes;
			app.save(collection);
			collection.listRule = rules.read;
			collection.viewRule = rules.read;
			collection.createRule = rules.create;
			collection.updateRule = rules.update;
			collection.deleteRule = rules.delete;
			app.save(collection);
			return collection;
		};

		const folders = saveOwnedCollection(
			'folders',
			'pbc_1792760001',
			[
				idField('text1792760010'),
				{ id: 'text1792760011', name: 'name', type: 'text', required: true, min: 1, max: 100 },
				relationField('relation1792760011', 'user', '_pb_users_auth_', true, false),
				...timestampFields('179276001')
			],
			['CREATE UNIQUE INDEX `uq_folders_user_name` ON `folders` (`user`, `name`)'],
			{
				read: 'user = @request.auth.id',
				create: 'user = @request.auth.id',
				update: 'user = @request.auth.id && @request.body.user:isset = false',
				delete: 'user = @request.auth.id'
			}
		);

		const tags = saveOwnedCollection(
			'tags',
			'pbc_1792760002',
			[
				idField('text1792760020'),
				{ id: 'text1792760021', name: 'name', type: 'text', required: true, min: 1, max: 50 },
				relationField('relation1792760021', 'user', '_pb_users_auth_', true, false),
				...timestampFields('179276002')
			],
			['CREATE UNIQUE INDEX `uq_tags_user_name` ON `tags` (`user`, `name`)'],
			{
				read: 'user = @request.auth.id',
				create: 'user = @request.auth.id',
				update: 'user = @request.auth.id && @request.body.user:isset = false',
				delete: 'user = @request.auth.id'
			}
		);

		const notes = new Collection({
			id: 'pbc_3395098727',
			type: 'base',
			name: 'notes',
			fields: [
				idField('text3208210256'),
				{ id: 'text724990059', name: 'title', type: 'text', required: false },
				{ id: 'text196455508', name: 'desc', type: 'text', required: false },
				relationField('relation1653163849', 'user', '_pb_users_auth_', false, false),
				relationField('relation1792760051', 'folder', folders.id, false, false),
				{
					id: 'autodate2990389176',
					name: 'created',
					type: 'autodate',
					onCreate: true,
					onUpdate: false,
					system: false
				},
				{
					id: 'autodate3332085495',
					name: 'updated',
					type: 'autodate',
					onCreate: true,
					onUpdate: true,
					system: false
				}
			],
			indexes: [],
			listRule: null,
			viewRule: null,
			createRule: null,
			updateRule: null,
			deleteRule: null
		});
		app.save(notes);
		notes.indexes = ['CREATE INDEX `idx_notes_user_created` ON `notes` (`user`, `created`)'];
		app.save(notes);
		notes.listRule = 'user = @request.auth.id';
		notes.viewRule = 'user = @request.auth.id';
		notes.createRule = 'user = @request.auth.id && (folder = "" || folder.user = @request.auth.id)';
		notes.updateRule =
			'user = @request.auth.id && @request.body.user:isset = false && (@request.body.folder:isset = false || @request.body.folder = "" || @request.body.folder.user = @request.auth.id)';
		notes.deleteRule = 'user = @request.auth.id';
		app.save(notes);

		saveOwnedCollection(
			'note_tags',
			'pbc_1792760003',
			[
				idField('text1792760030'),
				relationField('relation1792760031', 'note_id', notes.id, true, true),
				relationField('relation1792760032', 'tag_id', tags.id, true, true),
				...timestampFields('179276003')
			],
			[
				'CREATE UNIQUE INDEX `uq_note_tags_note_tag` ON `note_tags` (`note_id`, `tag_id`)',
				'CREATE INDEX `idx_note_tags_tag` ON `note_tags` (`tag_id`)'
			],
			{
				read: 'note_id.user = @request.auth.id && tag_id.user = @request.auth.id',
				create: 'note_id.user = @request.auth.id && tag_id.user = @request.auth.id',
				update:
					'note_id.user = @request.auth.id && tag_id.user = @request.auth.id && @request.body.note_id:isset = false && @request.body.tag_id:isset = false',
				delete: 'note_id.user = @request.auth.id && tag_id.user = @request.auth.id'
			}
		);

		saveOwnedCollection(
			'note_versions',
			'pbc_1792760004',
			[
				idField('text1792760040'),
				relationField('relation1792760041', 'note_id', notes.id, true, true),
				{ id: 'text1792760041', name: 'title', type: 'text', required: false },
				{ id: 'text1792760042', name: 'desc', type: 'text', required: false },
				...timestampFields('179276004')
			],
			['CREATE INDEX `idx_note_versions_note_created` ON `note_versions` (`note_id`, `created`)'],
			{
				read: 'note_id.user = @request.auth.id',
				create: 'note_id.user = @request.auth.id',
				update: null,
				delete: 'note_id.user = @request.auth.id'
			}
		);
	},
	(app) => {
		app.delete(app.findCollectionByNameOrId('note_versions'));
		app.delete(app.findCollectionByNameOrId('note_tags'));
		app.delete(app.findCollectionByNameOrId('notes'));
		app.delete(app.findCollectionByNameOrId('folders'));
		app.delete(app.findCollectionByNameOrId('tags'));
	}
);
