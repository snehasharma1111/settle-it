import { ApiRoute } from "@/server";
import { authControllers } from "@/controllers";
import { validation } from "@/server";

const api = new ApiRoute(
	{ POST: validation.email(authControllers.requestOtpWithEmail) },
	{ db: true }
);
const handler = api.getHandler();

export default handler;
