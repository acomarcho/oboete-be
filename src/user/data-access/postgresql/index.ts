import { PostgreSqlDatabase } from "../../../lib/postgresql";
import { UserDataAccessInterface } from "../../data-access-interface";
import { UserEntity } from "../../entity";
import { UserModel } from "./model";

export class PostgreSqlUserDataAccess implements UserDataAccessInterface {
	private database: PostgreSqlDatabase;

	constructor(database: PostgreSqlDatabase) {
		this.database = database;
	}

	public async insertUser(user: UserEntity): Promise<UserEntity> {
		const client = await this.database.getClient();
		try {
			await client.query("BEGIN");

			await client.query(
				`INSERT
          INTO users
            (id, username, email, password)
          VALUES
            ($1, $2, $3, $4)`,
				[
					user.getId(),
					user.getUsername(),
					user.getEmail(),
					user.getHashedPassword(),
				],
			);

			await client.query("COMMIT");
		} catch (error) {
			await client.query("ROLLBACK");
			throw error;
		} finally {
			client.release();
		}

		return user;
	}

	public async getUserById(id: string): Promise<UserEntity | null> {
		const pool = await this.database.getPool();
		const result = await pool.query<UserModel>(
			`SELECT
          u.id,
          u.username,
          u.email,
          u.password
        FROM
          users u
        WHERE
          u.id = $1`,
			[id],
		);

		if (result.rowCount === 0) {
			return null;
		}

		const userModel = result.rows[0];

		return new UserEntity({
			id: userModel.id,
			username: userModel.username,
			email: userModel.email,
			hashedPassword: userModel.password,
		});
	}

	public async getUserByUsername(username: string): Promise<UserEntity | null> {
		const pool = await this.database.getPool();
		const result = await pool.query<UserModel>(
			`SELECT
          u.id,
          u.username,
          u.email,
          u.password
        FROM
          users u
        WHERE
          u.username = $1`,
			[username],
		);

		if (result.rowCount === 0) {
			return null;
		}

		const userModel = result.rows[0];

		return new UserEntity({
			id: userModel.id,
			username: userModel.username,
			email: userModel.email,
			hashedPassword: userModel.password,
		});
	}

	public async getUserByEmail(email: string): Promise<UserEntity | null> {
		const pool = await this.database.getPool();
		const result = await pool.query<UserModel>(
			`SELECT
          u.id,
          u.username,
          u.email,
          u.password
        FROM
          users u
        WHERE
          u.email = $1`,
			[email],
		);

		if (result.rowCount === 0) {
			return null;
		}

		const userModel = result.rows[0];

		return new UserEntity({
			id: userModel.id,
			username: userModel.username,
			email: userModel.email,
			hashedPassword: userModel.password,
		});
	}

	public async upsertUserToken(userId: string, token: string): Promise<string> {
		const client = await this.database.getClient();
		try {
			await client.query("BEGIN");

			const userTokenQueryResult = await client.query(
				`
				SELECT
					ut.id
				FROM
					user_tokens ut
				WHERE
					ut.user_id = $1
			`,
				[userId],
			);

			if (userTokenQueryResult.rowCount === 0) {
				await client.query(
					`
					INSERT INTO
						user_tokens (user_id, token)
					VALUES
						($1, $2)
				`,
					[userId, token],
				);
			} else {
				await client.query(
					`UPDATE
						user_tokens
					SET
						token = $1
					WHERE
						user_id = $2`,
					[token, userId],
				);
			}

			await client.query("COMMIT");
		} catch (error) {
			await client.query("ROLLBACK");
			throw error;
		} finally {
			client.release();
		}

		return token;
	}

	public async deleteUserToken(userId: string): Promise<boolean> {
		const client = await this.database.getClient();
		try {
			await client.query("BEGIN");

			await client.query(
				`
				DELETE FROM
					user_tokens
				WHERE
					user_id = $1
			`,
				[userId],
			);

			await client.query("COMMIT");
		} catch (error) {
			await client.query("ROLLBACK");
			throw error;
		} finally {
			client.release();
		}

		return true;
	}

	public async getUserTokenByUserId(userId: string): Promise<string> {
		const pool = await this.database.getPool();
		const result = await pool.query<{ token: string }>(
			`SELECT
          ut.token
        FROM
          user_tokens ut
        WHERE
          ut.user_id = $1`,
			[userId],
		);

		if (result.rowCount === 0) {
			return "";
		}

		const resultRow = result.rows[0];

		return resultRow.token;
	}
}
