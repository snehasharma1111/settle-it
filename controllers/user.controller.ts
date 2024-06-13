import { HTTP } from "@/constants";
import { userService } from "@/services/api";
import { ApiRequest, ApiResponse } from "@/types/api";
import { getNonEmptyString, genericParse } from "@/utils/safety";

export const update = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const loggedInUserId = genericParse(getNonEmptyString, req.user?.id);
		const id = genericParse(getNonEmptyString, req.query.id);
		if (!id || !loggedInUserId)
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: HTTP.message.BAD_REQUEST });
		if (loggedInUserId !== id)
			return res
				.status(HTTP.status.FORBIDDEN)
				.json({ message: HTTP.message.FORBIDDEN });
		const foundUser = await userService.findById(id);
		if (!foundUser)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
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
			{ id: id as string },
			updatedBody
		);
		return res.status(HTTP.status.SUCCESS).json({
			message: HTTP.message.SUCCESS,
			data: updatedUser,
		});
	} catch (error: any) {
		console.error(error);
		return res.status(HTTP.status.INTERNAL_SERVER_ERROR).json({
			message: HTTP.message.INTERNAL_SERVER_ERROR,
		});
	}
};
