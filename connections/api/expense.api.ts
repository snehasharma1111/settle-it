import { http } from "@/connections";
import { ApiRes, ApiRequests, ApiResponses } from "@/types";

export class ExpenseApi {
	public static async getAllUserExpense(
		headers?: any
	): Promise<ApiRes<ApiResponses.GetUsersExpenses>> {
		const response = await http.get<ApiRes<ApiResponses.GetUsersExpenses>>(
			"/expenses",
			{ headers }
		);
		return response.data;
	}

	public static async getAllExpensesForGroup(
		{ groupId }: { groupId: string },
		headers?: any
	): Promise<ApiRes<ApiResponses.GetGroupExpenses>> {
		const response = await http.get<ApiRes<ApiResponses.GetGroupExpenses>>(
			`/group/expenses?groupId=${groupId}`,
			{ headers }
		);
		return response.data;
	}

	public static async getMembersOfExpense(
		{ groupId, expenseId }: { groupId: string; expenseId: string },
		headers?: any
	): Promise<ApiRes<ApiResponses.GetMembersForExpense>> {
		const response = await http.get<
			ApiRes<ApiResponses.GetMembersForExpense>
		>(`/group/expense/members?groupId=${groupId}&expenseId=${expenseId}`, {
			headers,
		});
		return response.data;
	}

	public static async createExpense(
		data: ApiRequests.CreateExpense,
		headers?: any
	): Promise<ApiRes<ApiResponses.CreateExpense>> {
		const response = await http.post<
			ApiRes<ApiResponses.CreateExpense>,
			ApiRequests.CreateExpense
		>(`/group/expense?groupId=${data.groupId}`, data, {
			headers,
		});
		return response.data;
	}

	public static async updateExpense(
		{
			groupId,
			expenseId,
			data,
		}: {
			groupId: string;
			expenseId: string;
			data: ApiRequests.UpdateExpense;
		},
		headers?: any
	): Promise<ApiRes<ApiResponses.UpdateExpense>> {
		const response = await http.patch<
			ApiRes<ApiResponses.UpdateExpense>,
			ApiRequests.UpdateExpense
		>(`/group/expense?groupId=${groupId}&expenseId=${expenseId}`, data, {
			headers,
		});
		return response.data;
	}

	public static async settleExpense(
		{ groupId, expenseId }: { groupId: string; expenseId: string },
		headers?: any
	): Promise<ApiRes<ApiResponses.SettleExpense>> {
		const response = await http.patch<
			ApiRes<ApiResponses.SettleExpense>,
			ApiRequests.SettleExpense
		>(
			`/group/expense/settle?groupId=${groupId}&expenseId=${expenseId}`,
			null,
			{ headers }
		);
		return response.data;
	}

	public static async deleteExpense(
		{ groupId, expenseId }: { groupId: string; expenseId: string },
		headers?: any
	): Promise<ApiRes<ApiResponses.RemoveExpense>> {
		const response = await http.delete<ApiRes<ApiResponses.RemoveExpense>>(
			`/group/expense?groupId=${groupId}&expenseId=${expenseId}`,
			{ headers }
		);
		return response.data;
	}
}
