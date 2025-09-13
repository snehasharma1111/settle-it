import { ApiRoute } from "@/server";
import { GroupController } from "@/controllers";

const apiRoute = new ApiRoute(
	{ GET: GroupController.getBalancesSummary },
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
