export type Note = {
	id: string;
	title: string;
	desc: string;
	created_at: string;
	folder_id: string;
	tags: Tag[];
};

export type Folder = {
	id: string;
	name: string;
	created_at: string;
};

export type Tag = {
	id: string;
	name: string;
};

export type NoteVersion = {
	id: string;
	title: string;
	desc: string;
	created_at: string;
};

export type User = {
	email: string;
	name: string;
	password: string;
	passwordConfirm: string;
};

export type AuthenticateInput = {
	email: string;
	password: string;
};

export type LoginOutput =
	{ success: true } | { success: false; reason: 'internal_server_error'; message: string };
