import { ApiRoute } from "@/server";
import { ExpenseController } from "@/controllers";

const apiRoute = new ApiRoute(
	{ PATCH: ExpenseController.settleExpense },
	{ db: true, auth: true, groupMember: true }
);

export default apiRoute.getHandler();
