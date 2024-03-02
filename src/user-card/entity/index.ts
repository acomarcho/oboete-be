import { Moment } from "moment";
import { v4 as uuidv4 } from "uuid";

export enum UserCardStatus {
	ToReviewImmediately = 0,
	ToReviewInOneDay = 1,
	ToReviewInTwoDays = 2,
	ToReviewInFourDays = 3,
	ToReviewInOneWeek = 4,
}

export class UserCardEntity {
	private id: string;
	private userId: string;
	private content: string;
	private status: UserCardStatus;
	private lastReviewedAt: Moment | null;
	private createdAt: Moment;
	private updatedAt: Moment;

	constructor({
		id = uuidv4(),
		userId,
		content,
		status,
		lastReviewedAt,
		createdAt,
		updatedAt,
	}: {
		id?: string;
		userId: string;
		content: string;
		status: UserCardStatus;
		lastReviewedAt: Moment | null;
		createdAt: Moment;
		updatedAt: Moment;
	}) {
		this.id = id;
		this.userId = userId;
		this.content = content;
		this.status = status;
		this.lastReviewedAt = lastReviewedAt;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	getId() {
		return this.id;
	}

	getUserId() {
		return this.userId;
	}

	getContent() {
		return this.content;
	}

	getStatus() {
		return this.status;
	}

	getLastReviewedAt() {
		return this.lastReviewedAt;
	}

	getCreatedAt() {
		return this.createdAt;
	}

	getUpdatedAt() {
		return this.updatedAt;
	}
}
