import { ApiRoute } from "@/server";
import { ExpenseController } from "@/controllers";

const apiRoute = new ApiRoute(
	{
		POST: ExpenseController.createExpense,
		PATCH: ExpenseController.updateExpense,
		DELETE: ExpenseController.removeExpense,
	},
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
