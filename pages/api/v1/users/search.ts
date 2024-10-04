import { userControllers } from "@/controllers";
import { ApiRouteHandler } from "@/helpers";

const api = new ApiRouteHandler(
	{ POST: userControllers.searchForUsers },
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
