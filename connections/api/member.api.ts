import { http } from "@/connections";
import { ApiRes } from "@/types/api";
import { IMember, IOwedRecord } from "@/types/member";

export const settleMemberInExpense = async (
	expenseId: string,
	memberId: string
): Promise<ApiRes<Array<IMember>>> => {
	try {
		const response = await http.patch(
			`/expenses/${expenseId}/settle/${memberId}`
		);
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error?.response?.data);
	}
};

export const settleOwedMembersInGroup = async (
	groupId: string,
	userA: string,
	userB: string
): Promise<ApiRes<Array<IOwedRecord>>> => {
	try {
		const response = await http.patch(`/groups/${groupId}/members/settle`, {
			userA,
			userB,
		});
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error?.response?.data);
	}
};
