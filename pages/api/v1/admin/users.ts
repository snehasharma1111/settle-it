import { adminControllers } from "@/controllers";
import { ApiWrapper } from "@/helpers";

const api = new ApiWrapper(
	{ GET: adminControllers.getAllUsers },
	{ db: true, admin: true }
);

const handler = api.getHandler();

export default handler;
