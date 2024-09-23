import { http } from "@/connections";
import {
	ApiRes,
	CreateGroupData,
	IBalancesSummary,
	IExpense,
	IGroup,
	ITransaction,
	UpdateGroupData,
} from "@/types";

export const getAllGroups = async (
	headers?: any
): Promise<ApiRes<Array<IGroup>>> => {
	const response = await http.get("/groups", { headers });
	return response.data;
};

export const getGroupDetails = async (
	id: string,
	headers?: any
): Promise<ApiRes<IGroup>> => {
	const response = await http.get(`/groups/${id}`, { headers });
	return response.data;
};

export const getGroupExpenses = async (
	id: string,
	headers?: any
): Promise<ApiRes<Array<IExpense>>> => {
	const response = await http.get(`/groups/${id}/expenses`, { headers });
	return response.data;
};

export const getBalancesSummary = async (
	id: string,
	headers?: any
): Promise<
	ApiRes<{
		expenditure: number;
		balances: IBalancesSummary;
	}>
> => {
	const response = await http.get(`/groups/${id}/summary`, { headers });
	return response.data;
};

export const getTransactions = async (
	id: string,
	headers?: any
): Promise<
	ApiRes<{
		expenditure: number;
		transactions: Array<ITransaction>;
	}>
> => {
	const response = await http.get(`/groups/${id}/transactions`, {
		headers,
	});
	return response.data;
};

export const createGroup = async (
	data: CreateGroupData,
	headers?: any
): Promise<ApiRes<IGroup>> => {
	const response = await http.post("/groups", data, { headers });
	return response.data;
};

export const updateGroup = async (
	id: string,
	data: UpdateGroupData,
	headers?: any
): Promise<ApiRes<IGroup>> => {
	const response = await http.patch(`/groups/${id}`, data, { headers });
	return response.data;
};

export const deleteGroup = async (
	id: string,
	headers?: any
): Promise<ApiRes<IGroup>> => {
	const response = await http.delete(`/groups/${id}`, { headers });
	return response.data;
};
