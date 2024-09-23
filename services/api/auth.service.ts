import { jwtSecret } from "@/config";
import { cacheParameter } from "@/constants";
import { logger } from "@/log";
import { User } from "@/models";
import { cache, getCacheKey, userService } from "@/services";
import { genericParse, getNonEmptyString } from "@/utils";
import jwt from "jsonwebtoken";

export const authenticate = async (token: string): Promise<User | null> => {
	try {
		const decoded: any = jwt.verify(token, jwtSecret);
		const userId = genericParse(getNonEmptyString, decoded.id);
		const foundUser = await cache.fetch(
			getCacheKey(cacheParameter.USER, { id: userId }),
			() => userService.findById(userId)
		);
		return foundUser;
	} catch (error) {
		logger.error(error);
		return null;
	}
};

export const generateToken = (id: string): string =>
	jwt.sign({ id }, jwtSecret, {
		expiresIn: "30d",
	});
