import { postgreSqlDatabase } from "../../../lib/postgresql";
import { UserDataAccessInterface } from "../../data-access-interface";
import { UserEntity } from "../../entity";
import { UserModel } from "./model";

export class PostgreSqlUserDataAccess implements UserDataAccessInterface {
  private database = postgreSqlDatabase;

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
        ]
      );

      await client.query("COMMIT");
    } catch {
      await client.query("ROLLBACK");
    } finally {
      client.release();
    }

    return user;
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
      [username]
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
      [email]
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
}
