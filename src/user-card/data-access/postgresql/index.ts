import moment from "moment";
import { postgreSqlDatabase } from "../../../lib/postgresql";
import {
	GetUserCardsFilter,
	UserCardDataAccessInterface,
} from "../../data-access-interface";
import { UserCardEntity } from "../../entity";
import { UserCardModel } from "./model";

export class PostgreSqlUserCardDataAccess
	implements UserCardDataAccessInterface
{
	private database = postgreSqlDatabase;

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

		const queryParams: string[] = [];
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

		const result: UserCardEntity[] = [];
		const queryResult = await pool.query<UserCardModel>(query, queryParams);

		for (const row of queryResult.rows) {
			result.push(
				new UserCardEntity({
					id: row.id,
					userId: row.userId,
					content: row.content,
					status: row.status,
					lastReviewedAt: row.lastReviewedAt
						? moment(row.lastReviewedAt)
						: null,
					createdAt: moment(row.createdAt),
					updatedAt: moment(row.updatedAt),
				}),
			);
		}

		return result;
	}
}
