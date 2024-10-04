import { expenseControllers } from "@/controllers";
import { ApiRouteHandler } from "@/helpers";

const api = new ApiRouteHandler(
	{ PATCH: expenseControllers.settleExpense },
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
