import { HTTP } from "@/constants";
import { groupControlllers } from "@/controllers";
import { db } from "@/db";
import { authMiddleware } from "@/middlewares";
import { ApiRequest, ApiResponse } from "@/types/api";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req: ApiRequest, res: ApiResponse) => {
	try {
		await db.connect();
		const { method } = req;

		switch (method) {
			case "GET":
				return authMiddleware.apiRoute(
					groupControlllers.getGroupDetailsAndExpenses
				)(req, res);
			case "PATCH":
				return authMiddleware.apiRoute(groupControlllers.updateGroup)(
					req,
					res
				);
			case "DELETE":
				return authMiddleware.apiRoute(groupControlllers.deleteGroup)(
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
		console.error(error);
		return res.status(HTTP.status.INTERNAL_SERVER_ERROR).json({
			message: error.message || HTTP.message.INTERNAL_SERVER_ERROR,
		});
	}
};

export default handler;
