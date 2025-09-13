import { ApiRoute } from "@/server";
import { GroupController } from "@/controllers";

const apiRoute = new ApiRoute(
	{ GET: GroupController.getAllTransactions },
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
