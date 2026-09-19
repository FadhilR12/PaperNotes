export type Note = {
	id: string;
	// user_id: string;
	title: string;
	desc: string;
	created_at: Date;
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
