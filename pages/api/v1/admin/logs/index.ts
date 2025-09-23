import { ApiRoute } from "@/server";
import { AdminController } from "@/controllers";

const apiRoute = new ApiRoute(
	{
		GET: AdminController.getAllLogFiles,
		POST: AdminController.getLogFileByName,
	},
	{ db: true, admin: true }
);

export default apiRoute.getHandler();
