import { ApiRoute } from "@/server";
import { AuthController } from "@/controllers";

const apiRoute = new ApiRoute(
	{ GET: AuthController.logout },
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
