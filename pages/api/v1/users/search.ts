import { userControllers } from "@/controllers";
import { ApiWrapper } from "@/helpers";

const api = new ApiWrapper(
	{ POST: userControllers.searchForUsers },
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
