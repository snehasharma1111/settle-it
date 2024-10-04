import { authControllers } from "@/controllers";
import { ApiRouteHandler } from "@/helpers";

const api = new ApiRouteHandler(
	{ GET: authControllers.logout },
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
