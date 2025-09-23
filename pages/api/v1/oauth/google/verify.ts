import { ApiRoute } from "@/server";
import { AuthController } from "@/controllers";

const apiRoute = new ApiRoute(
	{ POST: AuthController.verifyOAuthSignIn },
	{ db: true }
);

export default apiRoute.getHandler();
