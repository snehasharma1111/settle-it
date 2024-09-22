import { http } from "@/connections";
import {
	ApiRes,
	CreateExpenseData,
	IExpense,
	IMember,
	UpdateExpenseData,
} from "@/types";

export const getAllExpensesForUser = async (
	headers?: any
): Promise<ApiRes<Array<IExpense>>> => {
	const response = await http.get("/expenses", { headers });
	return response.data;
};

export const getMembersOfExpense = async (
	expenseId: string,
	headers?: any
): Promise<ApiRes<Array<IMember>>> => {
	const response = await http.get(`/expenses/${expenseId}/members`, {
		headers,
	});
	return response.data;
};

export const createExpense = async (
	data: CreateExpenseData,
	headers?: any
): Promise<ApiRes<IExpense>> => {
	const response = await http.post(`/groups/${data.groupId}/expense`, data, {
		headers,
	});
	return response.data;
};

export const updateExpense = async (
	id: string,
	data: UpdateExpenseData,
	headers?: any
): Promise<ApiRes<IExpense>> => {
	const response = await http.patch(`/expenses/${id}`, data, { headers });
	return response.data;
};

export const settleExpense = async (
	id: string,
	headers?: any
): Promise<ApiRes<Array<IMember>>> => {
	const response = await http.patch(
		`/expenses/${id}/settle`,
		{},
		{ headers }
	);
	return response.data;
};

export const deleteExpense = async (
	id: string,
	headers?: any
): Promise<ApiRes<IExpense>> => {
	const response = await http.delete(`/expenses/${id}`, { headers });
	return response.data;
};
