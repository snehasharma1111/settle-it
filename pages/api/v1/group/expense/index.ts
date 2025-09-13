import { ApiRoute } from "@/server";
import { ExpenseController } from "@/controllers";

const apiRoute = new ApiRoute(
	{
		POST: ExpenseController.createExpense,
		PATCH: ExpenseController.updateExpense,
		DELETE: ExpenseController.removeExpense,
	},
	{ db: true, auth: true, groupMember: true }
);

export default apiRoute.getHandler();
