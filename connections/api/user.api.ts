import { http } from "@/connections";
import { ApiRes, IUser } from "@/types";

export const updateUser = async (
	data: Partial<IUser>
): Promise<ApiRes<IUser>> => {
	const response = await http.patch("/users", data);
	return response.data;
};

export const searchForUsers = async (
	query: string
): Promise<ApiRes<Array<IUser>>> => {
	const response = await http.post("/users/search", { query });
	return response.data;
};

export const inviteUser = async (email: string): Promise<ApiRes<IUser>> => {
	const response = await http.post("/users/invite", { email });
	return response.data;
};
