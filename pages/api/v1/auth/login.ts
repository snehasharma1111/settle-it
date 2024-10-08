import { ApiRoute } from "@/server";
import { authControllers } from "@/controllers";
import { validation } from "@/server";

const api = new ApiRoute(
	{ POST: validation.email(authControllers.login) },
	{ db: true }
);

export default api.getHandler();
