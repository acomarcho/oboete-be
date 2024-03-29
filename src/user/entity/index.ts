import { v4 as uuidv4 } from "uuid";

export class UserEntity {
	private id: string;
	private username: string;
	private email: string;
	private hashedPassword: string;

	constructor({
		id = uuidv4(),
		username,
		email,
		hashedPassword,
	}: {
		id?: string;
		username: string;
		email: string;
		hashedPassword: string;
	}) {
		this.id = id;
		this.username = username;
		this.email = email;
		this.hashedPassword = hashedPassword;
	}

	public getId() {
		return this.id;
	}

	public getUsername() {
		return this.username;
	}

	public getEmail() {
		return this.email;
	}

	public getHashedPassword() {
		return this.hashedPassword;
	}
}
