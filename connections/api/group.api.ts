import { http } from "@/connections";
import {
	ApiRes,
	CreateGroupData,
	IBalancesSummary,
	IExpense,
	IGroup,
	IShare,
	ITransaction,
	UpdateGroupData,
} from "@/types";

export class GroupApi {
	public static async getAllGroups(
		headers?: any
	): Promise<ApiRes<Array<IGroup>>> {
		const response = await http.get("/groups", { headers });
		return response.data;
	}

	public static async getGroupDetails(
		id: string,
		headers?: any
	): Promise<ApiRes<IGroup>> {
		const response = await http.get(`/group?id=${id}`, { headers });
		return response.data;
	}

	public static async getGroupExpenses(
		id: string,
		headers?: any
	): Promise<ApiRes<Array<IExpense>>> {
		const response = await http.get(`/group/expenses?groupId=${id}`, {
			headers,
		});
		return response.data;
	}

	public static async getBalancesSummary(
		id: string,
		headers?: any
	): Promise<
		ApiRes<{
			expenditure: number;
			balances: IBalancesSummary;
			shares: Array<IShare>;
		}>
	> {
		const response = await http.get(`/group/summary?groupId=${id}`, {
			headers,
		});
		return response.data;
	}

	public static async getTransactions(
		id: string,
		headers?: any
	): Promise<
		ApiRes<{
			expenditure: number;
			transactions: Array<ITransaction>;
		}>
	> {
		const response = await http.get(`/group/transactions?groupId=${id}`, {
			headers,
		});
		return response.data;
	}

	public static async createGroup(
		data: CreateGroupData,
		headers?: any
	): Promise<ApiRes<IGroup>> {
		const response = await http.post("/groups", data, { headers });
		return response.data;
	}

	public static async updateGroup(
		id: string,
		data: UpdateGroupData,
		headers?: any
	): Promise<ApiRes<IGroup>> {
		const response = await http.patch(`/group?id=${id}`, data, { headers });
		return response.data;
	}

	public static async deleteGroup(
		id: string,
		headers?: any
	): Promise<ApiRes<IGroup>> {
		const response = await http.delete(`/group?id=${id}`, { headers });
		return response.data;
	}
}
