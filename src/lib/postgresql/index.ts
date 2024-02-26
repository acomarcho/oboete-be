import { Pool } from "pg";

class PostgreSqlDatabase {
	private pool: Pool;

	constructor() {
		this.pool = new Pool();
	}

	async getPool() {
		return this.pool;
	}

	async getClient() {
		return await this.pool.connect();
	}
}

export const postgreSqlDatabase = new PostgreSqlDatabase();
