import { ApiRoute } from "@/server";
import { MemberController } from "@/controllers";

const apiRoute = new ApiRoute(
	{ PATCH: MemberController.settleMemberInExpense },
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
