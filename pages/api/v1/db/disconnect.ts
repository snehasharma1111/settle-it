import { db } from "@/db";
import { ApiWrapper } from "@/helpers";
import { ApiRequest, ApiResponse } from "@/types";

const disconnectHandler = async (_: ApiRequest, res: ApiResponse) => {
	await db.disconnect();
	return res.status(200).json({ message: "Disconnected from DB" });
};

const api = new ApiWrapper({ GET: disconnectHandler });

const handler = api.getHandler();

export default handler;
