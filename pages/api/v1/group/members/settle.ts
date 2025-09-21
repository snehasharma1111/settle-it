import { ApiRoute } from "@/server";
import { MemberController } from "@/controllers";

const apiRoute = new ApiRoute(
	{ PATCH: MemberController.settleOwedMembersInGroup },
	{ db: true, auth: true, groupMember: true }
);

export default apiRoute.getHandler();
