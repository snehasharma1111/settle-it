import { http } from "@/connections";
import { ApiRes, ApiRequests, ApiResponses } from "@/types";

export class MemberApi {
	public static async settleMemberInExpense(
		{
			groupId,
			expenseId,
			memberId,
		}: {
			groupId: string;
			expenseId: string;
			memberId: string;
		},
		headers?: any
	): Promise<ApiRes<ApiResponses.SettleMemberInExpense>> {
		const response = await http.patch<
			ApiRes<ApiResponses.SettleMemberInExpense>,
			ApiRequests.SettleMemberInExpense
		>(
			`/group/expense/members/settle?groupId=${groupId}&expenseId=${expenseId}&memberId=${memberId}`,
			null,
			{ headers }
		);
		return response.data;
	}

	public static async settleOwedMembersInGroup(
		groupId: string,
		userA: string,
		userB: string
	): Promise<ApiRes<ApiResponses.SettleOwedMembersInGroup>> {
		const response = await http.patch<
			ApiRes<ApiResponses.SettleOwedMembersInGroup>,
			ApiRequests.SettleOwedMembersInGroup
		>(`/group/members/settle?groupId=${groupId}`, {
			userA,
			userB,
		});
		return response.data;
	}
}
