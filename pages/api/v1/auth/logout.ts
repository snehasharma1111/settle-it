import { authControllers } from "@/controllers";
import { ApiWrapper } from "@/helpers";

const api = new ApiWrapper(
	{ GET: authControllers.logout },
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
