import { HTTP } from "@/constants";
import { authControllers } from "@/controllers";
import { db } from "@/db";
import logger from "@/log";
import { validationMiddleware } from "@/middlewares";
import { ApiRequest, ApiResponse } from "@/types/api";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req: ApiRequest, res: ApiResponse) => {
	try {
		await db.connect();
		const { method } = req;

		switch (method) {
			case "POST":
				return validationMiddleware.email(
					authControllers.requestOtpWithEmail
				)(req, res);
			default:
				res.setHeader("Allow", ["POST"]);
				return res
					.status(HTTP.status.METHOD_NOT_ALLOWED)
					.send(`Method ${method} Not Allowed`);
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
