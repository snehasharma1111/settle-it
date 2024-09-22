import { http } from "@/connections";
import { ApiRes, IGroup, IUser } from "@/types";

export const getAllUsers = async (
	headers?: any
): Promise<ApiRes<Array<IUser>>> => {
	const response = await http.get("/admin/users", { headers });
	return response.data;
};

export const getAllGroups = async (
	headers?: any
): Promise<ApiRes<Array<IGroup>>> => {
	const response = await http.get("/admin/groups", { headers });
	return response.data;
};

export const getAllCacheData = async (headers?: any) => {
	const response = await http.get("/admin/cache", { headers });
	return response.data;
};

export const clearCacheData = async (headers?: any) => {
	const response = await http.delete("/admin/cache", { headers });
	return response.data;
};

export const getAllLogFiles = async (
	headers?: any
): Promise<ApiRes<Array<string>>> => {
	const response = await http.get("/logs", { headers });
	return response.data;
};

export const getLogFileByName = async (
	name: string,
	headers?: any
): Promise<ApiRes<string>> => {
	const response = await http.get(`/logs/${name}`, { headers });
	return response.data;
};
