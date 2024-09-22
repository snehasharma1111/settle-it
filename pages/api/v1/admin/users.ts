import { HTTP } from "@/constants";
import { adminControllers } from "@/controllers";
import { db } from "@/db";
import { logger } from "@/log";
import { adminMiddleware } from "@/middlewares";
import { ApiRequest, ApiResponse } from "@/types";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req: ApiRequest, res: ApiResponse) => {
	try {
		await db.connect();
		const { method } = req;

		switch (method) {
			case "GET":
				return adminMiddleware.apiRoute(adminControllers.getAllUsers)(
					req,
					res
				);
			default:
				res.setHeader("Allow", ["GET"]);
				return res
					.status(HTTP.status.METHOD_NOT_ALLOWED)
					.json({ message: `Method ${method} Not Allowed` });
		}
	} catch (error: any) {
		logger.error(error);
		return res.status(HTTP.status.INTERNAL_SERVER_ERROR).json({
			message: error.message || HTTP.message.INTERNAL_SERVER_ERROR,
		});
	}
};

export default handler;

export const config = {
	maxDuration: 60,
};
