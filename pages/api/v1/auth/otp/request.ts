import { authControllers } from "@/controllers";
import { ApiRouteHandler } from "@/helpers";

const api = new ApiRouteHandler(
	{ POST: authControllers.requestOtpWithEmail },
	{ db: true, auth: true }
);
const handler = api.getHandler();

export default handler;
