import { ApiRoute } from "@/server";
import { AuthController } from "@/controllers";

const apiRoute = new ApiRoute(
	{ POST: AuthController.continueOAuthWithGoogle },
	{ db: true }
);

export default apiRoute.getHandler();
