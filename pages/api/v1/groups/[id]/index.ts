import { groupControlllers } from "@/controllers";
import { ApiRouteHandler } from "@/helpers";

const api = new ApiRouteHandler(
	{
		GET: groupControlllers.getGroupDetails,
		PATCH: groupControlllers.updateGroup,
		DELETE: groupControlllers.deleteGroup,
	},
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
