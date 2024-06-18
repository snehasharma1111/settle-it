import { http } from "@/connections";
import { ApiRes } from "@/types/api";
import { IMember } from "@/types/member";

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
