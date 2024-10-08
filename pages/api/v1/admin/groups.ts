import { adminControllers } from "@/controllers";
import { ApiRoute } from "@/server";

const api = new ApiRoute(
	{ GET: adminControllers.getAllGroups },
	{ db: true, admin: true }
);

const handler = api.getHandler();

export default handler;
