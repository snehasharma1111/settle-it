import { ApiRoute } from "@/server";
import { GroupController } from "@/controllers";

const apiRoute = new ApiRoute(
	{ POST: GroupController.addMembers },
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
