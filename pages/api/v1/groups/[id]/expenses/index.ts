import { expenseControllers, groupControlllers } from "@/controllers";
import { ApiRouteHandler } from "@/helpers";

const api = new ApiRouteHandler(
	{
		GET: groupControlllers.getGroupExpenses,
		POST: expenseControllers.createNewExpense,
	},
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
