import { HTTP } from "@/constants";
import { logger } from "@/messages";
import cache from "@/services/cache";
import { ApiRequest, ApiResponse } from "@/types/api";

export const getAllCacheData = async (_: ApiRequest, res: ApiResponse) => {
	try {
		const keys: string[] = cache.getAll();
		if (keys.length === 0) {
			return res
				.status(200)
				.json({ message: HTTP.message.SUCCESS, data: null });
		}
		let cacheData = {};
		keys.forEach((key) => {
			Object.assign(cacheData, { [key]: cache.get(key) });
		});
		return res
			.status(200)
			.json({ message: HTTP.message.SUCCESS, data: cacheData });
	} catch (error) {
		logger.error(error);
		return res
			.status(500)
			.json({ message: HTTP.message.INTERNAL_SERVER_ERROR });
	}
};

export const clearCacheData = async (req: ApiRequest, res: ApiResponse) => {
	try {
		cache.flushAll();
		return res.status(204).json({ message: HTTP.message.SUCCESS });
	} catch (error) {
		logger.error(error);
		return res
			.status(500)
			.json({ message: HTTP.message.INTERNAL_SERVER_ERROR });
	}
};
