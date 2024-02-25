import express, { Express } from "express";
import dotenv from "dotenv";
import { PostgreSqlUserDataAccess } from "./user/data-access/postgresql";
import { RegisterUseCase } from "./user/use-case/register";
import { UserController } from "./user/controller";

dotenv.config();

const app: Express = express();
app.use(express.json());

const port = process.env.PORT || 3000;

const postgreSqlUserDataAccess = new PostgreSqlUserDataAccess();
const registerUseCase = new RegisterUseCase(postgreSqlUserDataAccess);
const userController = new UserController({
  registerUseCase,
});
app.use("/user", userController.getRouter());

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
