import { ApiRoute } from "@/server";
import { userControllers } from "@/controllers";
import { validation } from "@/server";

const api = new ApiRoute(
	{ POST: validation.email(userControllers.inviteUser) },
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
