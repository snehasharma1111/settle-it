import { authControllers } from "@/controllers";
import { ApiWrapper } from "@/helpers";

const api = new ApiWrapper(
	{ POST: authControllers.requestOtpWithEmail },
	{ db: true, auth: true }
);
const handler = api.getHandler();

export default handler;
