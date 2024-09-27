import { userControllers } from "@/controllers";
import { ApiWrapper } from "@/helpers";
import { validationMiddleware } from "@/middlewares";

const api = new ApiWrapper(
	{ POST: validationMiddleware.email(userControllers.inviteUser) },
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
