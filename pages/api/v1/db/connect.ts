import { db } from "@/db";
import { ApiRouteHandler } from "@/helpers";
import { ApiRequest, ApiResponse } from "@/types";

const connectHandler = async (_: ApiRequest, res: ApiResponse) => {
	await db.connect();
	return res.status(200).json({ message: "Connected to DB" });
};

const api = new ApiRouteHandler({ GET: connectHandler });

const handler = api.getHandler();

export default handler;
