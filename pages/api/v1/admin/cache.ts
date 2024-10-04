import { cacheControllers } from "@/controllers";
import { ApiRouteHandler } from "@/helpers";

const api = new ApiRouteHandler(
	{
		GET: cacheControllers.getAllCacheData,
		DELETE: cacheControllers.clearCacheData,
	},
	{ db: true, admin: true }
);

const handler = api.getHandler();

export default handler;
