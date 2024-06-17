import { http } from "@/connections";
import { ApiRes } from "@/types/api";
import { CreateExpenseData } from "@/types/expense";
import { IExpense } from "@/types/expenses";

export const createExpense = async (
	data: CreateExpenseData,
	headers?: any
): Promise<ApiRes<IExpense>> => {
	try {
		const response = await http.post(
			`/groups/${data.groupId}/expense`,
			data,
			{ headers }
		);
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error?.response?.data);
	}
};
