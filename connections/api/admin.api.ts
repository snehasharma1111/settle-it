import { http } from "@/connections";
import logger from "@/log";
import { ApiRes } from "@/types/api";
import { IGroup } from "@/types/group";
import { IUser } from "@/types/user";

export const getAllUsers = async (
	headers?: any
): Promise<ApiRes<Array<IUser>>> => {
	try {
		const res = await http.get("/admin/users", { headers });
		return Promise.resolve(res.data);
	} catch (error) {
		logger.error(error);
		return Promise.reject(error);
	}
};

export const getAllGroups = async (
	headers?: any
): Promise<ApiRes<Array<IGroup>>> => {
	try {
		const res = await http.get("/admin/groups", { headers });
		return Promise.resolve(res.data);
	} catch (error) {
		logger.error(error);
		return Promise.reject(error);
	}
};

export const getAllCacheData = async (headers?: any) => {
	try {
		const res = await http.get("/admin/cache", { headers });
		return Promise.resolve(res.data);
	} catch (error: any) {
		logger.error(error);
		return Promise.reject(error);
	}
};

export const clearCacheData = async (headers?: any) => {
	try {
		const res = await http.delete("/admin/cache", { headers });
		return Promise.resolve(res.data);
	} catch (error: any) {
		logger.error(error);
		return Promise.reject(error);
	}
};
