import { ApiRoute } from "@/server";
import { ExpenseController } from "@/controllers";

const apiRoute = new ApiRoute(
	{ PATCH: ExpenseController.settleExpense },
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
