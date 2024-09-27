import { cacheControllers } from "@/controllers";
import { ApiWrapper } from "@/helpers";

const api = new ApiWrapper(
	{
		GET: cacheControllers.getAllCacheData,
		DELETE: cacheControllers.clearCacheData,
	},
	{ db: true, admin: true }
);

const handler = api.getHandler();

export default handler;
