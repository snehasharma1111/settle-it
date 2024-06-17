import { http } from "@/connections";
import { ApiRes } from "@/types/api";
import { CreateExpenseData } from "@/types/expense";
import { IExpense } from "@/types/expense";

export const getAllExpensesForUser = async (
	headers?: any
): Promise<ApiRes<Array<IExpense>>> => {
	try {
		const response = await http.get("/expenses", { headers });
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error?.response?.data);
	}
};

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
