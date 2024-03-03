import moment from "moment";
import { PostgreSqlDatabase } from "../../../lib/postgresql";
import {
	GetUserCardsFilter,
	UserCardDataAccessInterface,
} from "../../data-access-interface";
import { UserCardEntity, UserCardStatus } from "../../entity";
import { UserCardModel } from "./model";

export class PostgreSqlUserCardDataAccess
	implements UserCardDataAccessInterface
{
	private database: PostgreSqlDatabase;

	constructor(database: PostgreSqlDatabase) {
		this.database = database;
	}

	async insertUserCard(userCard: UserCardEntity): Promise<UserCardEntity> {
		const client = await this.database.getClient();
		try {
			await client.query("BEGIN");

			await client.query(
				`INSERT
          INTO user_cards
            (id, user_id, content, status, last_reviewed_at, created_at, updated_at)
          VALUES
            ($1, $2, $3, $4, $5, $6, $7)`,
				[
					userCard.getId(),
					userCard.getUserId(),
					userCard.getContent(),
					userCard.getStatus(),
					userCard.getLastReviewedAt(),
					userCard.getCreatedAt(),
					userCard.getUpdatedAt(),
				],
			);

			await client.query("COMMIT");
		} catch (error) {
			await client.query("ROLLBACK");
			throw error;
		} finally {
			client.release();
		}

		return userCard;
	}

	async getUserCards(filter: GetUserCardsFilter): Promise<UserCardEntity[]> {
		const pool = await this.database.getPool();

		const queryParams: (string | moment.Moment)[] = [];
		let query = `
			SELECT
				uc.id,
				uc.user_id,
				uc.content,
				uc.status,
				uc.last_reviewed_at,
				uc.created_at,
				uc.updated_at
			FROM
				user_cards uc
		`;

		queryParams.push(filter.userId);
		query += `
			WHERE
				uc.user_id = $${queryParams.length}
		`;

		if (filter.dueReviewAt) {
			queryParams.push(filter.dueReviewAt);

			query += `
				AND
					(uc.last_reviewed_at is null)
				OR
					(
						(
							uc.status = ${UserCardStatus.ToReviewImmediately}
							AND uc.last_reviewed_at < $${queryParams.length}
						)
						OR
						(
							uc.status = ${UserCardStatus.ToReviewInOneDay}
							AND uc.last_reviewed_at + interval '1 day' < $${queryParams.length}
						)
						OR
						(
							uc.status = ${UserCardStatus.ToReviewInTwoDays}
							AND uc.last_reviewed_at + interval '2 days' < $${queryParams.length}
						)
						OR
						(
							uc.status = ${UserCardStatus.ToReviewInFourDays}
							AND uc.last_reviewed_at + interval '4 days' < $${queryParams.length}
						)
						OR
						(
							uc.status = ${UserCardStatus.ToReviewInOneWeek}
							AND uc.last_reviewed_at + interval '7 days' < $${queryParams.length}
						)
					)
			`;
		}

		if (filter.dueReviewAt) {
			query += `
				ORDER BY
						CASE
							WHEN uc.status = ${UserCardStatus.ToReviewImmediately} THEN COALESCE(uc.last_reviewed_at, uc.created_at)
							WHEN uc.status = ${UserCardStatus.ToReviewInOneDay} THEN COALESCE(uc.last_reviewed_at, uc.created_at) + interval '1 day'
							WHEN uc.status = ${UserCardStatus.ToReviewInTwoDays} THEN COALESCE(uc.last_reviewed_at, uc.created_at) + interval '2 days'
							WHEN uc.status = ${UserCardStatus.ToReviewInFourDays} THEN COALESCE(uc.last_reviewed_at, uc.created_at) + interval '4 days'
							WHEN uc.status = ${UserCardStatus.ToReviewInOneWeek} THEN COALESCE(uc.last_reviewed_at, uc.created_at) + interval '7 days'
						END
				ASC
			`;
		}

		const result: UserCardEntity[] = [];
		const queryResult = await pool.query<UserCardModel>(query, queryParams);

		for (const row of queryResult.rows) {
			result.push(
				new UserCardEntity({
					id: row.id,
					userId: row.user_id,
					content: row.content,
					status: row.status,
					lastReviewedAt: row.last_reviewed_at
						? moment(row.last_reviewed_at)
						: null,
					createdAt: moment(row.created_at),
					updatedAt: moment(row.updated_at),
				}),
			);
		}

		return result;
	}

	async updateUserCard(userCard: UserCardEntity): Promise<UserCardEntity> {
		const client = await this.database.getClient();
		try {
			await client.query("BEGIN");

			await client.query(
				`UPDATE 
					user_cards
				SET
					content = $1,
					status = $2,
					last_reviewed_at = $3,
					updated_at = $4
        WHERE
					id = $5`,
				[
					userCard.getContent(),
					userCard.getStatus(),
					userCard.getLastReviewedAt(),
					userCard.getUpdatedAt(),
					userCard.getId(),
				],
			);

			await client.query("COMMIT");
		} catch (error) {
			await client.query("ROLLBACK");
			throw error;
		} finally {
			client.release();
		}

		return userCard;
	}

	async getUserCardById(userCardId: string): Promise<UserCardEntity | null> {
		const pool = await this.database.getPool();

		const returnedRows = await pool.query<UserCardModel>(
			`
			SELECT
				uc.id,
				uc.user_id,
				uc.content,
				uc.status,
				uc.last_reviewed_at,
				uc.created_at,
				uc.updated_at
			FROM
				user_cards uc
			WHERE
				uc.id = $1
		`,
			[userCardId],
		);

		if (returnedRows.rowCount === 0) {
			return null;
		}

		const row = returnedRows.rows[0];
		return new UserCardEntity({
			id: row.id,
			userId: row.user_id,
			content: row.content,
			status: row.status,
			lastReviewedAt: row.last_reviewed_at
				? moment(row.last_reviewed_at)
				: null,
			createdAt: moment(row.created_at),
			updatedAt: moment(row.updated_at),
		});
	}
}
