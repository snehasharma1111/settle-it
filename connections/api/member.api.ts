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
			`/groups/${groupId}/expenses/${expenseId}/settle/${memberId}`,
			{ headers }
		);
		return response.data;
	}

	public static async settleOwedMembersInGroup(
		groupId: string,
		userA: string,
		userB: string
	): Promise<ApiRes<Array<IOwedRecord>>> {
		const response = await http.patch(`/groups/${groupId}/members/settle`, {
			userA,
			userB,
		});
		return response.data;
	}
}
