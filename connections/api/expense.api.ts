import { http } from "@/connections";
import {
	ApiRes,
	CreateExpenseData,
	IExpense,
	IMember,
	UpdateExpenseData,
} from "@/types";

export const getAllExpensesForUser = async (
	{ groupId }: { groupId: string },
	headers?: any
): Promise<ApiRes<Array<IExpense>>> => {
	const response = await http.get(`/groups/${groupId}/expenses`, { headers });
	return response.data;
};

export const getMembersOfExpense = async (
	{ groupId, expenseId }: { groupId: string; expenseId: string },
	headers?: any
): Promise<ApiRes<Array<IMember>>> => {
	const response = await http.get(
		`/groups/${groupId}/expenses/${expenseId}/members`,
		{ headers }
	);
	return response.data;
};

export const createExpense = async (
	data: CreateExpenseData,
	headers?: any
): Promise<ApiRes<IExpense>> => {
	const response = await http.post(`/groups/${data.groupId}/expenses`, data, {
		headers,
	});
	return response.data;
};

export const updateExpense = async (
	{
		groupId,
		expenseId,
		data,
	}: { groupId: string; expenseId: string; data: UpdateExpenseData },
	headers?: any
): Promise<ApiRes<IExpense>> => {
	const response = await http.patch(
		`/groups/${groupId}/expenses/${expenseId}`,
		data,
		{ headers }
	);
	return response.data;
};

export const settleExpense = async (
	{ groupId, expenseId }: { groupId: string; expenseId: string },
	headers?: any
): Promise<ApiRes<Array<IMember>>> => {
	const response = await http.patch(
		`/groups/${groupId}/expenses/${expenseId}/settle`,
		{},
		{ headers }
	);
	return response.data;
};

export const deleteExpense = async (
	{ groupId, expenseId }: { groupId: string; expenseId: string },
	headers?: any
): Promise<ApiRes<IExpense>> => {
	const response = await http.delete(
		`/groups/${groupId}/expenses/${expenseId}`,
		{ headers }
	);
	return response.data;
};
