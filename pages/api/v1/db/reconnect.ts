import { db } from "@/db";
import { ApiRoute } from "@/server";
import { ApiRequest, ApiResponse } from "@/types";
const reconnectionHandler = async (_: ApiRequest, res: ApiResponse) => {
	await db.disconnect();
	await db.connect();
	return res.status(200).json({ message: "Reconnected to DB" });
};

const api = new ApiRoute({ GET: reconnectionHandler });

const handler = api.getHandler();

export default handler;
