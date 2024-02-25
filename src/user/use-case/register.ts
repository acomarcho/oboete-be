import { HttpError } from "../../lib/error/http-error";
import { UserDataAccessInterface } from "../data-access-interface";
import { UserEntity } from "../entity";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";

export class RegisterUseCase {
  private userDataAccess: UserDataAccessInterface;

  constructor(userDataAccess: UserDataAccessInterface) {
    this.userDataAccess = userDataAccess;
  }

  async execute({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }): Promise<UserEntity> {
    const userByEmail = await this.userDataAccess.getUserByEmail(email);
    if (userByEmail !== null) {
      throw new HttpError(StatusCodes.BAD_REQUEST, "Email already taken!");
    }

    const userByUsername = await this.userDataAccess.getUserByUsername(
      username
    );
    if (userByUsername !== null) {
      throw new HttpError(StatusCodes.BAD_REQUEST, "Username already taken!");
    }

    const hashedPassword = await bcrypt.hash(
      password,
      process.env.HASH_ROUNDS ? parseInt(process.env.HASH_ROUNDS) : 12
    );

    const registeredUser = await this.userDataAccess.insertUser(
      new UserEntity({
        username,
        email,
        hashedPassword,
      })
    );

    return registeredUser;
  }
}
