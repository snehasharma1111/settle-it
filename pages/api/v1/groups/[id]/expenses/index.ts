import { expenseControllers, groupControlllers } from "@/controllers";
import { ApiWrapper } from "@/helpers";

const api = new ApiWrapper(
	{
		GET: groupControlllers.getGroupExpenses,
		POST: expenseControllers.createNewExpense,
	},
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
