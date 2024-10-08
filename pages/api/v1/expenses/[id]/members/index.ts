import { memberControllers } from "@/controllers";
import { ApiRoute } from "@/server";

const api = new ApiRoute(
	{ GET: memberControllers.getMembersForExpense },
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
