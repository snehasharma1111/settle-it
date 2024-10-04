import { memberControllers } from "@/controllers";
import { ApiRouteHandler } from "@/helpers";

const api = new ApiRouteHandler(
	{ PATCH: memberControllers.settleOwedMembersInGroup },
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
