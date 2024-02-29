import express from "express";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { HttpResponse } from "../lib/response";
import { RequestWithUserId } from "../types/express";

const isAuthenticated = (
	req: RequestWithUserId,
	res: express.Response,
	next: express.NextFunction,
) => {
	if (!req.cookies?.accessToken) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json(new HttpResponse(null, new Error("Invalid access token")).toJson());
	}

	try {
		const decodedToken = jwt.verify(
			req.cookies.accessToken,
			process.env.ACCESS_SECRET || "secret",
		);

		type jwtToken = {
			userId: string;
		};
		const tokenSchema = Joi.object<jwtToken>({
			userId: Joi.string().required(),
		}).unknown(true);
		const { value: parsedToken, error } = tokenSchema.validate(decodedToken);

		if (error) {
			throw new Error("Invalid access token!");
		}

		req.userId = parsedToken.userId;

		next();
	} catch (err) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json(new HttpResponse(null, new Error("Invalid access token")).toJson());
	}
};

export default isAuthenticated;
