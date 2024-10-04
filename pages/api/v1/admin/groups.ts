import { adminControllers } from "@/controllers";
import { ApiRouteHandler } from "@/helpers";

const api = new ApiRouteHandler(
	{ GET: adminControllers.getAllGroups },
	{ db: true, admin: true }
);

const handler = api.getHandler();

export default handler;
