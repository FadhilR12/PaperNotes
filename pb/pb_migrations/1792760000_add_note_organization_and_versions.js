/// <reference path="../pb_data/types.d.ts" />
migrate(
	(app) => {
		const timestampFields = (collectionName) => [
			{
				id: `autodate179276${{ folders: '001', tags: '002', note_tags: '003', note_versions: '004' }[collectionName]}1`,
				name: 'created',
				type: 'autodate',
				onCreate: true,
				onUpdate: false,
				system: false
			},
			{
				id: `autodate179276${{ folders: '001', tags: '002', note_tags: '003', note_versions: '004' }[collectionName]}2`,
				name: 'updated',
				type: 'autodate',
				onCreate: true,
				onUpdate: true,
				system: false
			}
		];

		const idField = (collectionName) => ({
			id: `text179276${{ folders: '001', tags: '002', note_tags: '003', note_versions: '004' }[collectionName]}0`,
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

		const collectionIds = {
			folders: 'pbc_1792760001',
			tags: 'pbc_1792760002',
			note_tags: 'pbc_1792760003',
			note_versions: 'pbc_1792760004'
		};

		const ownedCollection = (name, fields, rules, indexes) => {
			const collection = new Collection({
				id: collectionIds[name],
				type: 'base',
				name,
				fields: [idField(name), ...fields, ...timestampFields(name)],
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

		const folders = ownedCollection(
			'folders',
			[
				{
					id: 'text1792760011',
					name: 'name',
					type: 'text',
					required: true,
					min: 1,
					max: 100
				},
				relationField('relation1792760011', 'user', '_pb_users_auth_', true, false)
			],
			{
				read: 'user = @request.auth.id',
				create: 'user = @request.auth.id',
				update: 'user = @request.auth.id && @request.body.user:isset = false',
				delete: 'user = @request.auth.id'
			},
			['CREATE UNIQUE INDEX `uq_folders_user_name` ON `folders` (`user`, `name`)']
		);
		const tags = ownedCollection(
			'tags',
			[
				{
					id: 'text1792760021',
					name: 'name',
					type: 'text',
					required: true,
					min: 1,
					max: 50
				},
				relationField('relation1792760021', 'user', '_pb_users_auth_', true, false)
			],
			{
				read: 'user = @request.auth.id',
				create: 'user = @request.auth.id',
				update: 'user = @request.auth.id && @request.body.user:isset = false',
				delete: 'user = @request.auth.id'
			},
			['CREATE UNIQUE INDEX `uq_tags_user_name` ON `tags` (`user`, `name`)']
		);
		const notes = app.findCollectionByNameOrId('notes');
		notes.fields.add(
			new Field({
				id: 'relation1792760051',
				name: 'folder',
				type: 'relation',
				collectionId: folders.id,
				required: false,
				cascadeDelete: false,
				minSelect: 0,
				maxSelect: 1,
				system: false
			})
		);
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

		const noteTags = ownedCollection(
			'note_tags',
			[
				relationField('relation1792760031', 'note_id', notes.id, true, true),
				relationField('relation1792760032', 'tag_id', tags.id, true, true)
			],
			{
				read: 'note_id.user = @request.auth.id && tag_id.user = @request.auth.id',
				create: 'note_id.user = @request.auth.id && tag_id.user = @request.auth.id',
				update:
					'note_id.user = @request.auth.id && tag_id.user = @request.auth.id && @request.body.note_id:isset = false && @request.body.tag_id:isset = false',
				delete: 'note_id.user = @request.auth.id && tag_id.user = @request.auth.id'
			},
			[
				'CREATE UNIQUE INDEX `uq_note_tags_note_tag` ON `note_tags` (`note_id`, `tag_id`)',
				'CREATE INDEX `idx_note_tags_tag` ON `note_tags` (`tag_id`)'
			]
		);
		app.save(noteTags);

		const versions = ownedCollection(
			'note_versions',
			[
				relationField('relation1792760041', 'note_id', notes.id, true, true),
				{ id: 'text1792760041', name: 'title', type: 'text', required: false },
				{ id: 'text1792760042', name: 'desc', type: 'text', required: false }
			],
			{
				read: 'note_id.user = @request.auth.id',
				create: 'note_id.user = @request.auth.id',
				update: null,
				delete: 'note_id.user = @request.auth.id'
			},
			['CREATE INDEX `idx_note_versions_note_created` ON `note_versions` (`note_id`, `created`)']
		);
		app.save(versions);
	},
	(app) => {
		const versions = app.findCollectionByNameOrId('note_versions');
		app.delete(versions);

		const noteTags = app.findCollectionByNameOrId('note_tags');
		app.delete(noteTags);

		const notes = app.findCollectionByNameOrId('notes');
		notes.fields.removeByName('folder');
		notes.indexes = [];
		notes.listRule = '';
		notes.viewRule = '';
		notes.createRule = '';
		notes.updateRule = '';
		notes.deleteRule = '';
		app.save(notes);

		const folders = app.findCollectionByNameOrId('folders');
		app.delete(folders);

		const tags = app.findCollectionByNameOrId('tags');
		app.delete(tags);
	}
);
