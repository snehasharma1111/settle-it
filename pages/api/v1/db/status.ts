import { db } from "@/db";
import { ApiRoute } from "@/server";
import { ApiRequest, ApiResponse } from "@/types";

const statusHandler = async (_: ApiRequest, res: ApiResponse) => {
	const isReady = db.isReady();
	return res.status(200).json({ data: isReady });
};

const api = new ApiRoute({ GET: statusHandler });

const handler = api.getHandler();

export default handler;
