import { groupControlllers } from "@/controllers";
import { ApiRouteHandler } from "@/helpers";

const api = new ApiRouteHandler(
	{
		GET: groupControlllers.getAllGroups,
		POST: groupControlllers.createGroup,
	},
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
