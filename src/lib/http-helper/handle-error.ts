import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "../error/http-error";
import { HttpResponse } from "../response";

export const handleError = (res: Response, error: unknown) => {
	if (error instanceof HttpError) {
		return res
			.status(error.getStatusCode())
			.json(new HttpResponse(null, new Error(error.getMessage())).toJson());
	}
	if (error instanceof Error) {
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json(new HttpResponse(null, new Error(error.message)).toJson());
	}
	return res
		.status(StatusCodes.INTERNAL_SERVER_ERROR)
		.json(new HttpResponse(null, new Error("Internal server error")).toJson());
};
