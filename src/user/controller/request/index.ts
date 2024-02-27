import Joi from "joi";

export type RegisterRequest = {
	username: string;
	email: string;
	password: string;
};

export const registerSchema = Joi.object<RegisterRequest>({
	username: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});

export type LoginRequest = {
	usernameOrEmail: string;
	password: string;
};

export const loginSchema = Joi.object<LoginRequest>({
	usernameOrEmail: Joi.string().required(),
	password: Joi.string().required(),
});
