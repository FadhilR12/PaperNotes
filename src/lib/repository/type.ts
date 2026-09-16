export type Note = {
	id: string;
	// user_id: string;
	title: string;
	desc: string;
	created_at: Date;
};

export type User = {
	id: string;
	email: string;
	name: string;
	password: string;
};
