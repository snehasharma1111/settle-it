import { HTTP } from "@/constants";
import { groupService } from "@/services/api";
import { ApiRequest, ApiResponse } from "@/types/api";

export const getAllGroups = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const groups = await groupService.findAll();
		return res.status(HTTP.status.SUCCESS).json({
			message: HTTP.message.SUCCESS,
			data: groups,
		});
	} catch (error: any) {
		console.error(error);
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
