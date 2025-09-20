import { HTTP } from "@/constants";
import { ExpenseService, MemberService } from "@/services";
import { ApiRequest, ApiResponse } from "@/types";
import { genericParse, getNonEmptyString, getSearchParam } from "@/utils";
import { Logger } from "@/log";

export class MemberController {
	public static async getMembersForExpense(
		req: ApiRequest,
		res: ApiResponse
	) {
		Logger.debug("getMembersForExpense -> url", req.url);
		const expenseId = genericParse(
			getNonEmptyString,
			getSearchParam(req.url, "expenseId")
		);
		const members = await MemberService.getMembersOfExpense(expenseId);
		return res
			.status(HTTP.status.SUCCESS)
			.json({ message: HTTP.message.SUCCESS, data: members });
	}
	public static async settleMemberInExpense(
		req: ApiRequest,
		res: ApiResponse
	) {
		const loggedInUserId = genericParse(getNonEmptyString, req.user?.id);
		const memberId = genericParse(
			getNonEmptyString,
			getSearchParam(req.url, "expenseId")
		);
		const members = await ExpenseService.settleMemberInExpense({
			memberId,
			loggedInUserId,
		});
		return res
			.status(HTTP.status.SUCCESS)
			.json({ message: HTTP.message.SUCCESS, data: members });
	}
	public static async settleOwedMembersInGroup(
		req: ApiRequest,
		res: ApiResponse
	) {
		const loggedInUserId = genericParse(getNonEmptyString, req.user?.id);
		const userA = genericParse(getNonEmptyString, req.body.userA);
		const userB = genericParse(getNonEmptyString, req.body.userB);
		const groupId = genericParse(getNonEmptyString, req.group?.id);
		const owedBalances = await MemberService.settleOwedMembersInGroup({
			loggedInUserId,
			groupId,
			userA,
			userB,
		});
		return res
			.status(HTTP.status.SUCCESS)
			.json({ message: HTTP.message.SUCCESS, data: owedBalances });
	}
}
