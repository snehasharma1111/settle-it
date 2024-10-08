import { adminControllers } from "@/controllers";
import { ApiRoute } from "@/server";

const api = new ApiRoute(
	{ GET: adminControllers.getAllUsers },
	{ db: true, admin: true }
);

const handler = api.getHandler();

export default handler;
