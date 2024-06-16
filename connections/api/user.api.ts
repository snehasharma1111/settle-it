import { http } from "@/connections";
import { ApiRes } from "@/types/api";
import { IUser } from "@/types/user";

export const updateUser = async (
	id: string,
	data: Partial<IUser>
): Promise<ApiRes<IUser>> => {
	try {
		const response = await http.patch(`/users/${id}`, data);
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
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
		console.error(error);
		return Promise.reject(error?.response?.data);
	}
};
