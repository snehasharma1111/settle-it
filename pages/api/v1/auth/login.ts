import { authControllers } from "@/controllers";
import { ApiRouteHandler } from "@/helpers";
import { validationMiddleware } from "@/middlewares";

const api = new ApiRouteHandler(
	{ POST: validationMiddleware.email(authControllers.login) },
	{ db: true }
);

export default api.getHandler();
