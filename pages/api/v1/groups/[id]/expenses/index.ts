import { HTTP } from "@/constants";
import { expenseControllers, groupControlllers } from "@/controllers";
import { db } from "@/db";
import { logger } from "@/log";
import { authMiddleware } from "@/middlewares";
import { ApiRequest, ApiResponse } from "@/types";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req: ApiRequest, res: ApiResponse) => {
	try {
		await db.connect();
		const { method } = req;

		switch (method) {
			case "GET":
				return authMiddleware.apiRoute(
					groupControlllers.getGroupExpenses
				)(req, res);
			case "POST":
				return authMiddleware.apiRoute(
					expenseControllers.createNewExpense
				)(req, res);
			default:
				res.setHeader("Allow", ["POST"]);
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