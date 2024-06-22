import { http } from "@/connections";
import { ApiRes } from "@/types/api";
import {
	CreateExpenseData,
	IExpense,
	UpdateExpenseData,
} from "@/types/expense";
import { IMember } from "@/types/member";

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

export const getMembersOfExpense = async (
	expenseId: string,
	headers?: any
): Promise<ApiRes<Array<IMember>>> => {
	try {
		const response = await http.get(`/expenses/${expenseId}/members`, {
			headers,
		});
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

export const updateExpense = async (
	id: string,
	data: UpdateExpenseData,
	headers?: any
): Promise<ApiRes<IExpense>> => {
	try {
		const response = await http.patch(`/expenses/${id}`, data, { headers });
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error?.response?.data);
	}
};

export const settleExpense = async (
	id: string,
	headers?: any
): Promise<ApiRes<Array<IMember>>> => {
	try {
		const response = await http.patch(
			`/expenses/${id}/settle`,
			{},
			{ headers }
		);
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error?.response?.data);
	}
};

export const deleteExpense = async (
	id: string,
	headers?: any
): Promise<ApiRes<IExpense>> => {
	try {
		const response = await http.delete(`/expenses/${id}`, { headers });
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error?.response?.data);
	}
};
