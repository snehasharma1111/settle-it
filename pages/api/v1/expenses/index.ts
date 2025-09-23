import { ApiRoute } from "@/server";
import { ExpenseController } from "@/controllers";

const apiRoute = new ApiRoute(
	{ GET: ExpenseController.getUsersExpenses },
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
