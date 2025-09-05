import { ApiRoute } from "@/server";
import { UserController } from "@/controllers";

const apiRoute = new ApiRoute(
	{ PATCH: UserController.updateUserProfile },
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
