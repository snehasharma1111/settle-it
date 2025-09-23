import { ApiRoute } from "@/server";
import { GroupController } from "@/controllers";

const apiRoute = new ApiRoute(
	{
		GET: GroupController.getGroupDetails,
		PATCH: GroupController.updateGroupDetails,
		DELETE: GroupController.deleteGroup,
	},
	{ db: true, auth: true, groupMember: true }
);

export default apiRoute.getHandler();
