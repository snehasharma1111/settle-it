import { HTTP } from "@/constants";
import { logsControllers } from "@/controllers";
import { ApiRequest, ApiResponse } from "@/types/api";
import { NextApiHandler } from "next";

const handler: NextApiHandler = (req: ApiRequest, res: ApiResponse) => {
	try {
		const { method } = req;

		switch (method) {
			case "POST":
				return logsControllers.log(req, res);
			default:
				res.setHeader("Allow", ["POST"]);
				return res
					.status(HTTP.status.METHOD_NOT_ALLOWED)
					.json({ message: `Method ${method} Not Allowed` });
		}
	} catch (error: any) {
		return res.status(HTTP.status.INTERNAL_SERVER_ERROR).json({
			message: error.message || HTTP.message.INTERNAL_SERVER_ERROR,
		});
	}
};

export default handler;

export const config = {
	maxDuration: 60,
};
