import { postgreSqlDatabase } from "../../../lib/postgresql";
import { UserCardDataAccessInterface } from "../../data-access-interface";
import { UserCardEntity } from "../../entity";

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
}
