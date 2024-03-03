import { Pool, PoolConfig } from "pg";

export class PostgreSqlDatabase {
	private pool: Pool;

	constructor(config?: PoolConfig) {
		this.pool = new Pool(config);
	}

	async getPool() {
		return this.pool;
	}

	async getClient() {
		return await this.pool.connect();
	}
}
