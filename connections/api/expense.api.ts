import { http } from "@/connections";
import {
	ApiRes,
	CreateExpenseData,
	IExpense,
	IMember,
	UpdateExpenseData,
} from "@/types";

export class ExpenseApi {
	public static async getAllUserExpense(
		headers?: any
	): Promise<ApiRes<Array<IExpense>>> {
		const response = await http.get("/expenses", { headers });
		return response.data;
	}

	public static async getAllExpensesForGroup(
		{ groupId }: { groupId: string },
		headers?: any
	): Promise<ApiRes<Array<IExpense>>> {
		const response = await http.get(`/group/expenses?groupId=${groupId}`, {
			headers,
		});
		return response.data;
	}

	public static async getMembersOfExpense(
		{ groupId, expenseId }: { groupId: string; expenseId: string },
		headers?: any
	): Promise<ApiRes<Array<IMember>>> {
		const response = await http.get(
			`/group/expense/members?groupId=${groupId}&expenseId=${expenseId}`,
			{ headers }
		);
		return response.data;
	}

	public static async createExpense(
		data: CreateExpenseData,
		headers?: any
	): Promise<ApiRes<IExpense>> {
		const response = await http.post(
			`/group/expense?groupId=${data.groupId}`,
			data,
			{
				headers,
			}
		);
		return response.data;
	}

	public static async updateExpense(
		{
			groupId,
			expenseId,
			data,
		}: { groupId: string; expenseId: string; data: UpdateExpenseData },
		headers?: any
	): Promise<ApiRes<IExpense>> {
		const response = await http.patch(
			`/group/expense?groupId=${groupId}&expenseId=${expenseId}`,
			data,
			{ headers }
		);
		return response.data;
	}

	public static async settleExpense(
		{ groupId, expenseId }: { groupId: string; expenseId: string },
		headers?: any
	): Promise<ApiRes<Array<IMember>>> {
		const response = await http.patch(
			`/group/expense/settle?groupId=${groupId}&expenseId=${expenseId}`,
			{},
			{ headers }
		);
		return response.data;
	}

	public static async deleteExpense(
		{ groupId, expenseId }: { groupId: string; expenseId: string },
		headers?: any
	): Promise<ApiRes<IExpense>> {
		const response = await http.delete(
			`/group/expense?groupId=${groupId}&expenseId=${expenseId}`,
			{ headers }
		);
		return response.data;
	}
}
