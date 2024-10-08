import { expenseControllers, groupControlllers } from "@/controllers";
import { ApiRoute } from "@/server";

const api = new ApiRoute(
	{
		GET: groupControlllers.getGroupExpenses,
		POST: expenseControllers.createNewExpense,
	},
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
