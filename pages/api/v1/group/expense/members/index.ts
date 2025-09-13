import { ApiRoute } from "@/server";
import { MemberController } from "@/controllers";

const apiRoute = new ApiRoute(
	{ GET: MemberController.getMembersForExpense },
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
