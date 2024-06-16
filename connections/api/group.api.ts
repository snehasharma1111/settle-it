import { http } from "@/connections";
import { ApiRes } from "@/types/api";
import { IExpense } from "@/types/expenses";
import { CreateGroupData, IGroup } from "@/types/group";

export const getAllGroups = async (
	headers?: any
): Promise<ApiRes<Array<IGroup>>> => {
	try {
		const response = await http.get("/groups", { headers });
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error?.response?.data);
	}
};

export const getGroupDetails = async (
	id: string,
	headers?: any
): Promise<
	ApiRes<{
		group: IGroup;
		expenses: Array<IExpense>;
	}>
> => {
	try {
		const response = await http.get(`/groups/${id}`, { headers });
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error?.response?.data);
	}
};

export const createGroup = async (
	data: CreateGroupData,
	headers?: any
): Promise<ApiRes<IGroup>> => {
	try {
		const response = await http.post("/groups", data, { headers });
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error?.response?.data);
	}
};
