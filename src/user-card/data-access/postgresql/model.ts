export type UserCardModel = {
	id: string;
	user_id: string;
	content: string;
	status: number;
	last_reviewed_at: Date | null;
	created_at: Date;
	updated_at: Date;
};
