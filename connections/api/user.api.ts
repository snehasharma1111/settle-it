import { http } from "@/connections";
import logger from "@/log";
import { ApiRes } from "@/types/api";
import { IUser } from "@/types/user";

export const updateUser = async (
	data: Partial<IUser>
): Promise<ApiRes<IUser>> => {
	try {
		const response = await http.patch("/users", data);
		return Promise.resolve(response.data);
	} catch (error: any) {
		logger.error(error);
		return Promise.reject(error?.response?.data);
	}
};

export const searchForUsers = async (
	query: string
): Promise<ApiRes<Array<IUser>>> => {
	try {
		const response = await http.post("/users/search", { query });
		return Promise.resolve(response.data);
	} catch (error: any) {
		logger.error(error);
		return Promise.reject(error?.response?.data);
	}
};

export const inviteUser = async (email: string): Promise<ApiRes<IUser>> => {
	try {
		const response = await http.post("/users/invite", { email });
		return Promise.resolve(response.data);
	} catch (error: any) {
		logger.error(error);
		return Promise.reject(error?.response?.data);
	}
};
