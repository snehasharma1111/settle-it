import { cacheControllers } from "@/controllers";
import { ApiRoute } from "@/server";

const api = new ApiRoute(
	{
		GET: cacheControllers.getAllCacheData,
		DELETE: cacheControllers.clearCacheData,
	},
	{ db: true, admin: true }
);

const handler = api.getHandler();

export default handler;
