import { memberControllers } from "@/controllers";
import { ApiRouteHandler } from "@/helpers";

const api = new ApiRouteHandler(
	{ GET: memberControllers.getMembersForExpense },
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
