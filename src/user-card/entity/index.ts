import moment from "moment";
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

	getDueReviewAt() {
		const lastReviewedAt = this.getLastReviewedAt();
		let dueReviewAt = moment();

		if (this.getStatus() === UserCardStatus.ToReviewImmediately) {
			if (lastReviewedAt === null) {
				dueReviewAt = this.getCreatedAt();
			} else {
				dueReviewAt = lastReviewedAt;
			}
		} else if (this.getStatus() === UserCardStatus.ToReviewInOneDay) {
			if (lastReviewedAt === null) {
				dueReviewAt = moment().add(1, "d");
			} else {
				dueReviewAt = lastReviewedAt.add(1, "d");
			}
		} else if (this.getStatus() === UserCardStatus.ToReviewInTwoDays) {
			if (lastReviewedAt === null) {
				dueReviewAt = moment().add(2, "d");
			} else {
				dueReviewAt = lastReviewedAt.add(2, "d");
			}
		} else if (this.getStatus() === UserCardStatus.ToReviewInFourDays) {
			if (lastReviewedAt === null) {
				dueReviewAt = moment().add(4, "d");
			} else {
				dueReviewAt = lastReviewedAt.add(4, "d");
			}
		} else if (this.getStatus() === UserCardStatus.ToReviewInOneWeek) {
			if (lastReviewedAt === null) {
				dueReviewAt = moment().add(7, "d");
			} else {
				dueReviewAt = lastReviewedAt.add(7, "d");
			}
		}

		return dueReviewAt;
	}
}
