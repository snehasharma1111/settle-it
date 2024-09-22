import { jwtSecret } from "@/config";
import { logger } from "@/messages";
import { User } from "@/models";
import { userService } from "@/services/api";
import cache from "@/services/cache";
import { cacheParameter, getCacheKey } from "@/utils/cache";
import { genericParse, getNonEmptyString } from "@/utils/safety";
import jwt from "jsonwebtoken";

export const authenticate = async (token: string): Promise<User | null> => {
	try {
		const decoded: any = jwt.verify(token, jwtSecret);
		const userId = genericParse(getNonEmptyString, decoded.id);
		const foundUser = await cache.fetch(
			getCacheKey(cacheParameter.USER, { id: userId }),
			() => {
				return userService.findById(userId);
			}
		);
		if (!foundUser) {
			return null;
		}
		return foundUser as User;
	} catch (error) {
		logger.error(error);
		return null;
	}
};

export const generateToken = (id: string): string =>
	jwt.sign({ id }, jwtSecret, {
		expiresIn: "30d",
	});
