import { userControllers } from "@/controllers";
import { ApiRouteHandler } from "@/helpers";

const api = new ApiRouteHandler(
	{ PATCH: userControllers.updateUserDetails },
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
