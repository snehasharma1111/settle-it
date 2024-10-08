import { userControllers } from "@/controllers";
import { ApiRoute } from "@/server";

const api = new ApiRoute(
	{ PATCH: userControllers.updateUserDetails },
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
