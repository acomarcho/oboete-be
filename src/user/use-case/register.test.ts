import { HttpError } from "../../lib/error/http-error";
import { UserDataAccessInterface } from "../data-access-interface";
import { UserEntity } from "../entity";
import { RegisterUseCase } from "./register";
import { StatusCodes } from "http-status-codes";

class MockUserDataAccess implements UserDataAccessInterface {
  async insertUser(user: UserEntity): Promise<UserEntity> {
    return user;
  }

  async getUserByUsername(username: string): Promise<UserEntity | null> {
    if (username === "mock") {
      return new UserEntity({
        username: "mock",
        email: "mock@mock.com",
        hashedPassword: "mock",
      });
    }

    return null;
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    if (email === "mock@mock.com") {
      return new UserEntity({
        username: "mock",
        email: "mock@mock.com",
        hashedPassword: "mock",
      });
    }

    return null;
  }
}

let mockUserDataAccess: MockUserDataAccess;
let registerUseCase: RegisterUseCase;

beforeAll(() => {
  mockUserDataAccess = new MockUserDataAccess();
  registerUseCase = new RegisterUseCase(mockUserDataAccess);
});

test("should fail because username is already taken", () => {
  expect(
    async () =>
      await registerUseCase.execute({
        username: "mock",
        email: "dumdum@gmail.com",
        password: "12345678",
      })
  ).rejects.toThrow(
    new HttpError(StatusCodes.BAD_REQUEST, "Username already taken!")
  );
});

test("should fail because email is already taken", () => {
  expect(
    async () =>
      await registerUseCase.execute({
        username: "dumdum",
        email: "mock@mock.com",
        password: "12345678",
      })
  ).rejects.toThrow(
    new HttpError(StatusCodes.BAD_REQUEST, "Email already taken!")
  );
});

test("should successfully register user", async () => {
  const registeredUser = await registerUseCase.execute({
    username: "dumdum",
    email: "dumdum@gmail.com",
    password: "12345678",
  });

  expect(registeredUser).toMatchObject({
    username: "dumdum",
    email: "dumdum@gmail.com",
  });
});
