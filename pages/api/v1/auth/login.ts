import { authControllers } from "@/controllers";
import { ApiWrapper } from "@/helpers";
import { validationMiddleware } from "@/middlewares";

const api = new ApiWrapper(
	{ POST: validationMiddleware.email(authControllers.login) },
	{ db: true }
);

export default api.getHandler();
