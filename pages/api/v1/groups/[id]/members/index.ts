import { groupControlllers } from "@/controllers";
import { ApiRouteHandler } from "@/helpers";

const api = new ApiRouteHandler(
	{ POST: groupControlllers.addGroupMembers },
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
