import { authControllers } from "@/controllers";
import { ApiRoute } from "@/server";

const api = new ApiRoute(
	{ GET: authControllers.verify },
	{ db: true, auth: true }
);
const handler = api.getHandler();

export default handler;
