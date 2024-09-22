import { http } from "@/connections";
import { ApiRes, IMember, IOwedRecord } from "@/types";

export const settleMemberInExpense = async (
	expenseId: string,
	memberId: string
): Promise<ApiRes<Array<IMember>>> => {
	const response = await http.patch(
		`/expenses/${expenseId}/settle/${memberId}`
	);
	return response.data;
};

export const settleOwedMembersInGroup = async (
	groupId: string,
	userA: string,
	userB: string
): Promise<ApiRes<Array<IOwedRecord>>> => {
	const response = await http.patch(`/groups/${groupId}/members/settle`, {
		userA,
		userB,
	});
	return response.data;
};
