import { HTTP, USER_STATUS } from "@/constants";
import logger from "@/log";
import { userService } from "@/services/api";
import cache from "@/services/cache";
import { ApiRequest, ApiResponse } from "@/types/api";
import { cacheParameter, getCacheKey } from "@/utils/cache";
import { genericParse, getNonEmptyString } from "@/utils/safety";

export const getLoggedInUserDetails = async (
	req: ApiRequest,
	res: ApiResponse
) => {
	try {
		const foundUser = req.user;
		if (!foundUser)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		const loggedInUserId = foundUser.id;
		const id = genericParse(getNonEmptyString, req.query.id);
		if (!id || !loggedInUserId)
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: HTTP.message.BAD_REQUEST });
		if (loggedInUserId !== id)
			return res
				.status(HTTP.status.FORBIDDEN)
				.json({ message: HTTP.message.FORBIDDEN });
		return res
			.status(HTTP.status.SUCCESS)
			.json({ message: HTTP.message.SUCCESS, data: foundUser });
	} catch (error: any) {
		logger.error(error);
		if (error.message && error.message.startsWith("Invalid input:")) {
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: HTTP.message.BAD_REQUEST });
		} else {
			return res.status(HTTP.status.INTERNAL_SERVER_ERROR).json({
				message: HTTP.message.INTERNAL_SERVER_ERROR,
			});
		}
	}
};

export const updateUserDetails = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const foundUser = req.user;
		if (!foundUser)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		const loggedInUserId = foundUser.id;
		const keysToUpdate = ["name", "phone", "avatar"];
		const updatedBody: any = {};
		Object.keys(req.body).forEach((key: any) => {
			if (keysToUpdate.includes(key)) {
				if (
					(req.body[key] === null ||
						req.body[key] === undefined ||
						req.body[key] === "") &&
					((foundUser as any)[key] === null ||
						(foundUser as any)[key] === undefined ||
						(foundUser as any)[key] === "")
				) {
					return;
				} else if (req.body[key] !== (foundUser as any)[key]) {
					updatedBody[key] = req.body[key];
				} else if (!(foundUser as any)[key]) {
					updatedBody[key] = req.body[key];
				}
			}
		});
		if (updatedBody.phone) {
			const phoneExists = await userService.findOne({
				phone: updatedBody.phone,
			});
			if (phoneExists) {
				return res
					.status(HTTP.status.CONFLICT)
					.json({ message: "Phone number already in use" });
			}
		}
		const updatedUser = await userService.update(
			{ id: loggedInUserId },
			updatedBody
		);
		cache.invalidate(
			getCacheKey(cacheParameter.USER, { id: loggedInUserId })
		);
		return res.status(HTTP.status.SUCCESS).json({
			message: HTTP.message.SUCCESS,
			data: updatedUser,
		});
	} catch (error: any) {
		logger.error(error);
		return res.status(HTTP.status.INTERNAL_SERVER_ERROR).json({
			message: HTTP.message.INTERNAL_SERVER_ERROR,
		});
	}
};

export const inviteUser = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const loggedInUserId = genericParse(getNonEmptyString, req.user?.id);
		const email = genericParse(getNonEmptyString, req.body.email);
		if (!email || !loggedInUserId)
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: HTTP.message.BAD_REQUEST });
		const foundUser = await userService.findOne({ email });
		if (foundUser)
			return res
				.status(HTTP.status.CONFLICT)
				.json({ message: "User already exists" });
		await userService.invite(email, loggedInUserId);
		const createdUser = await userService.create({
			email,
			status: USER_STATUS.INVITED,
			invitedBy: loggedInUserId,
		});
		return res.status(HTTP.status.CREATED).json({
			message: "User created successfully",
			data: createdUser,
		});
	} catch (error: any) {
		logger.error(error);
		return res.status(HTTP.status.INTERNAL_SERVER_ERROR).json({
			message: HTTP.message.INTERNAL_SERVER_ERROR,
		});
	}
};

export const searchForUsers = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const loggedInUserId = genericParse(getNonEmptyString, req.user?.id);
		const query = genericParse(getNonEmptyString, req.body.query);
		if (!query || !loggedInUserId) {
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: HTTP.message.BAD_REQUEST });
		}
		if (query.length < 3) {
			return res.status(HTTP.status.BAD_REQUEST).json({
				message: "Query must be at least 3 characters",
			});
		}
		const foundUsers = await userService.searchByEmail(query);
		return res.status(HTTP.status.SUCCESS).json({
			message: "User found successfully",
			data: foundUsers || [],
		});
	} catch (error: any) {
		logger.error(error);
		return res.status(HTTP.status.INTERNAL_SERVER_ERROR).json({
			message: HTTP.message.INTERNAL_SERVER_ERROR,
		});
	}
};
