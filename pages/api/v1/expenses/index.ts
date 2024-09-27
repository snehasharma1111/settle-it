import { expenseControllers } from "@/controllers";
import { ApiWrapper } from "@/helpers";

const api = new ApiWrapper(
	{
		GET: expenseControllers.getAllExpensesForUser,
	},
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
