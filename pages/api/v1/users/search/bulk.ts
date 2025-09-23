import { ApiRoute } from "@/server";
import { UserController } from "@/controllers";

const apiRoute = new ApiRoute(
	{ POST: UserController.searchInBulk },
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
