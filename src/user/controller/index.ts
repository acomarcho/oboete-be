import express from "express";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "../../lib/error/http-error";
import { HttpResponse } from "../../lib/response";
import { RegisterUseCase } from "../use-case/register";
import { registerSchema } from "./request";

export class UserController {
  private router;
  private registerUseCase;

  constructor({ registerUseCase }: { registerUseCase: RegisterUseCase }) {
    this.registerUseCase = registerUseCase;

    this.router = express.Router();

    this.router.post("/", async (req, res) => {
      try {
        const { value: registerBody, error } = registerSchema.validate(
          req.body
        );

        if (error) {
          throw new HttpError(StatusCodes.BAD_REQUEST, error.message);
        }

        const { username, email, password } = registerBody;
        const registeredUser = await this.registerUseCase.execute({
          username,
          email,
          password,
        });

        return res.status(StatusCodes.OK).json(
          new HttpResponse({
            user: {
              username: registeredUser.getUsername(),
              email: registeredUser.getEmail(),
            },
          })
        );
      } catch (error) {
        if (error instanceof HttpError) {
          return res
            .status(error.getStatusCode())
            .json(new HttpResponse(null, error.getMessage()).toJson());
        }
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json(new HttpResponse(null, error));
      }
    });
  }

  getRouter() {
    return this.router;
  }
}
