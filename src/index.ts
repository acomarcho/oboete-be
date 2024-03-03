import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import logger from "pino-http";
import { allowedOrigins } from "./lib/constant/origin";
import { Jwt } from "./lib/jwt";
import { UserCardController } from "./user-card/controller";
import { PostgreSqlUserCardDataAccess } from "./user-card/data-access/postgresql";
import { CreateUserCardUseCase } from "./user-card/use-case/create-user-card";
import { GetUserCardsUseCase } from "./user-card/use-case/get-user-cards";
import { ReviewUserCardUseCase } from "./user-card/use-case/review-user-card";
import { UserController } from "./user/controller";
import { PostgreSqlUserDataAccess } from "./user/data-access/postgresql";
import { LoginUseCase } from "./user/use-case/login";
import { LogOutUseCase } from "./user/use-case/logout";
import { RefreshTokenUseCase } from "./user/use-case/refresh-token";
import { RegisterUseCase } from "./user/use-case/register";

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cookieParser());
app.use(logger());
app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
	}),
);

const port = process.env.PORT || 3000;

const jwt = new Jwt();

const postgreSqlUserDataAccess = new PostgreSqlUserDataAccess();
const registerUseCase = new RegisterUseCase(postgreSqlUserDataAccess);
const loginUseCase = new LoginUseCase(postgreSqlUserDataAccess, jwt);
const logoutUseCase = new LogOutUseCase(postgreSqlUserDataAccess);
const refreshTokenUseCase = new RefreshTokenUseCase(
	postgreSqlUserDataAccess,
	jwt,
);
const userController = new UserController({
	registerUseCase,
	loginUseCase,
	logoutUseCase,
	refreshTokenUseCase,
});
app.use("/user", userController.getRouter());

const postgreSqlUserCardDataAccess = new PostgreSqlUserCardDataAccess();
const createUserCardUseCase = new CreateUserCardUseCase({
	userCardDataAccess: postgreSqlUserCardDataAccess,
	userDataAccess: postgreSqlUserDataAccess,
});
const getUserCardsUseCase = new GetUserCardsUseCase({
	userCardDataAccess: postgreSqlUserCardDataAccess,
	userDataAccess: postgreSqlUserDataAccess,
});
const reviewUserCardUseCase = new ReviewUserCardUseCase({
	userCardDataAccess: postgreSqlUserCardDataAccess,
	userDataAccess: postgreSqlUserDataAccess,
});
const userCardController = new UserCardController({
	createUserCardUseCase,
	getUserCardsUseCase,
	reviewUserCardUseCase,
});
app.use("/user-card", userCardController.getRouter());

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
