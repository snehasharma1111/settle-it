import { ApiWrapper } from "@/helpers";
import { ApiRequest, ApiResponse } from "@/types";

const healthCallback = (_: ApiRequest, res: ApiResponse) => {
	return res.status(200).json({ message: "API is healthy" });
};

const api = new ApiWrapper({ GET: healthCallback }, { db: true });

const handler = api.getHandler();

export default handler;
