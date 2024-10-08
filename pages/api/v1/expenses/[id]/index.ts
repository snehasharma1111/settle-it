import { expenseControllers } from "@/controllers";
import { ApiRoute } from "@/server";

const api = new ApiRoute(
	{
		PATCH: expenseControllers.updateExpense,
		DELETE: expenseControllers.removeExpense,
	},
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
