import { groupControlllers } from "@/controllers";
import { ApiRoute } from "@/server";

const api = new ApiRoute(
	{ POST: groupControlllers.addGroupMembers },
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
