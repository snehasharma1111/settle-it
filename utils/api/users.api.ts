import { http } from "@/connections";
import logger from "@/log";
import { IUser } from "@/types/user";

export const getAllUsers = async () => {
	try {
		const res = await http.get("/users");
		return Promise.resolve(res.data);
	} catch (error) {
		logger.error(error);
		return Promise.reject(error);
	}
};

export const updateUser = async (user_id: string, data: Partial<IUser>) => {
	try {
		const res = await http.put(`/users/${user_id}`, data);
		return Promise.resolve(res.data);
	} catch (error) {
		logger.error(error);
		return Promise.reject(error);
	}
};
