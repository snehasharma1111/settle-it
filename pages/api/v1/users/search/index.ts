import { ApiRoute } from "@/server";
import { UserController } from "@/controllers";

const apiRoute = new ApiRoute(
	{ POST: UserController.searchForUsers },
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
