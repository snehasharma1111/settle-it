import { GroupController } from "@/controllers";
import { ApiRoute } from "@/server";

const apiRoute = new ApiRoute(
	{
		GET: GroupController.getGroupsForUser,
		POST: GroupController.createGroup,
	},
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
