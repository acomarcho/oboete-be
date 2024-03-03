import dotenv from "dotenv";
import { PostgreSqlUserDataAccess } from ".";
import { PostgreSqlDatabase } from "../../../lib/postgresql";
import { UserEntity } from "../../entity";
dotenv.config();

let testDatabase: PostgreSqlDatabase;
let testDataAccess: PostgreSqlUserDataAccess;

beforeAll(() => {
	testDatabase = new PostgreSqlDatabase({
		user: process.env.TEST_PGUSER,
		password: process.env.TEST_PGPASSWORD,
		host: process.env.TEST_PGHOST,
		database: process.env.TEST_PGDATABASE,
		port: process.env.TEST_PGPORT
			? parseInt(process.env.TEST_PGPORT)
			: undefined,
	});

	testDataAccess = new PostgreSqlUserDataAccess(testDatabase);
});

afterAll(async () => {
	const pool = await testDatabase.getPool();
	await pool.query("DELETE FROM users");
	await pool.end();
});

describe("insertUser method", () => {
	it("should insert user", async () => {
		const pool = await testDatabase.getPool();
		await pool.query("DELETE FROM users");

		const insertedUser = await testDataAccess.insertUser(
			new UserEntity({
				id: "f9b10e20-575c-4cf5-8386-6c748ef409d7",
				username: "mock",
				email: "mock@mock.com",
				hashedPassword: "mock",
			}),
		);

		const insertResult = await pool.query(
			"SELECT * FROM users WHERE email='mock@mock.com'",
		);

		expect(insertedUser.getUsername()).toBe("mock");
		expect(insertResult.rowCount).toBe(1);
	});
});

describe("getUserById method", () => {
	it("should get user", async () => {
		const pool = await testDatabase.getPool();
		await pool.query("DELETE FROM users");
		await pool.query(`
    INSERT INTO 
      users (id, username, email, password)
    VALUES
      ('f9b10e20-575c-4cf5-8386-6c748ef409d7', 'mock', 'mock@mock.com', 'mock')
    `);

		const user = await testDataAccess.getUserById(
			"f9b10e20-575c-4cf5-8386-6c748ef409d7",
		);

		expect(user).not.toBeNull();
	});

	it("should not get user", async () => {
		const pool = await testDatabase.getPool();
		await pool.query("DELETE FROM users");
		await pool.query(`
    INSERT INTO 
      users (id, username, email, password)
    VALUES
      ('f9b10e20-575c-4cf5-8386-6c748ef409d7', 'mock', 'mock@mock.com', 'mock')
    `);

		const user = await testDataAccess.getUserById(
			"5f314fcf-1626-4c51-9cff-3253fab7a11e",
		);

		expect(user).toBeNull();
	});
});

describe("getUserByEmail method", () => {
	it("should get user", async () => {
		const pool = await testDatabase.getPool();
		await pool.query("DELETE FROM users");
		await pool.query(`
    INSERT INTO 
      users (id, username, email, password)
    VALUES
      ('f9b10e20-575c-4cf5-8386-6c748ef409d7', 'mock', 'mock@mock.com', 'mock')
    `);

		const user = await testDataAccess.getUserByEmail("mock@mock.com");

		expect(user).not.toBeNull();
	});

	it("should not get user", async () => {
		const pool = await testDatabase.getPool();
		await pool.query("DELETE FROM users");
		await pool.query(`
    INSERT INTO 
      users (id, username, email, password)
    VALUES
      ('f9b10e20-575c-4cf5-8386-6c748ef409d7', 'mock', 'mock@mock.com', 'mock')
    `);

		const user = await testDataAccess.getUserByEmail("wrong@email.com");

		expect(user).toBeNull();
	});
});

describe("getUserByUsername method", () => {
	it("should get user", async () => {
		const pool = await testDatabase.getPool();
		await pool.query("DELETE FROM users");
		await pool.query(`
    INSERT INTO 
      users (id, username, email, password)
    VALUES
      ('f9b10e20-575c-4cf5-8386-6c748ef409d7', 'mock', 'mock@mock.com', 'mock')
    `);

		const user = await testDataAccess.getUserByUsername("mock");

		expect(user).not.toBeNull();
	});

	it("should not get user", async () => {
		const pool = await testDatabase.getPool();
		await pool.query("DELETE FROM users");
		await pool.query(`
    INSERT INTO 
      users (id, username, email, password)
    VALUES
      ('f9b10e20-575c-4cf5-8386-6c748ef409d7', 'mock', 'mock@mock.com', 'mock')
    `);

		const user = await testDataAccess.getUserByUsername("wrongUsername");

		expect(user).toBeNull();
	});
});
