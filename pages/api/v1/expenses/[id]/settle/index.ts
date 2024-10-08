import { expenseControllers } from "@/controllers";
import { ApiRoute } from "@/server";

const api = new ApiRoute(
	{ PATCH: expenseControllers.settleExpense },
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
