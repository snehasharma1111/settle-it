import { ApiRoute } from "@/server";
import { AdminController } from "@/controllers";

const apiRoute = new ApiRoute(
	{ GET: AdminController.getAllUsers },
	{ db: true, admin: true }
);

export default apiRoute.getHandler();
