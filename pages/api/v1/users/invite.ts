import { userControllers } from "@/controllers";
import { ApiRouteHandler } from "@/helpers";
import { validationMiddleware } from "@/middlewares";

const api = new ApiRouteHandler(
	{ POST: validationMiddleware.email(userControllers.inviteUser) },
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
