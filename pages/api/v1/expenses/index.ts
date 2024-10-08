import { expenseControllers } from "@/controllers";
import { ApiRoute } from "@/server";

const api = new ApiRoute(
	{
		GET: expenseControllers.getAllExpensesForUser,
	},
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
