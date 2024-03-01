import { UserCardStatus } from "../../entity";

export type UserCardModel = {
	id: string;
	userId: string;
	content: string;
	status: number;
	lastReviewedAt: string | null;
	createdAt: string;
	updatedAt: string;
};
