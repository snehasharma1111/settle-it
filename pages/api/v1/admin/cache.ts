import { ApiRoute } from "@/server";
import { AdminController } from "@/controllers";

const apiRoute = new ApiRoute(
	{
		GET: AdminController.getAllCacheData,
		DELETE: AdminController.clearAllCacheData,
	},
	{ db: true, admin: true }
);

export default apiRoute.getHandler();
