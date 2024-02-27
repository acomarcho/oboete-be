import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import logger from "pino-http";
import { allowedOrigins } from "./lib/constant/origin";
import { UserController } from "./user/controller";
import { PostgreSqlUserDataAccess } from "./user/data-access/postgresql";
import { LoginUseCase } from "./user/use-case/login";
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

const postgreSqlUserDataAccess = new PostgreSqlUserDataAccess();
const registerUseCase = new RegisterUseCase(postgreSqlUserDataAccess);
const loginUseCase = new LoginUseCase(postgreSqlUserDataAccess);
const userController = new UserController({
	registerUseCase,
	loginUseCase,
});
app.use("/user", userController.getRouter());

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
