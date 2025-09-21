import { http } from "@/connections";
import { ApiRes, IMember, IOwedRecord } from "@/types";

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
	): Promise<ApiRes<Array<IMember>>> {
		const response = await http.patch(
			`/group/expense/members/settle?groupId=${groupId}&expenseId=${expenseId}&memberId=${memberId}`,
			{ headers }
		);
		return response.data;
	}

	public static async settleOwedMembersInGroup(
		groupId: string,
		userA: string,
		userB: string
	): Promise<ApiRes<Array<IOwedRecord>>> {
		const response = await http.patch(
			`/group/members/settle?groupId=${groupId}`,
			{
				userA,
				userB,
			}
		);
		return response.data;
	}
}
