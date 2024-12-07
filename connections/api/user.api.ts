import { http } from "@/connections";
import { ApiRes, IUser } from "@/types";

export class UserApi {
	public static async updateUser(
		data: Partial<IUser>
	): Promise<ApiRes<IUser>> {
		const response = await http.patch("/users", data);
		return response.data;
	}

	public static async searchForUsers(
		query: string
	): Promise<ApiRes<Array<IUser>>> {
		const response = await http.post("/users/search", { query });
		return response.data;
	}

	public static async inviteUser(email: string): Promise<ApiRes<IUser>> {
		const response = await http.post("/users/invite", { email });
		return response.data;
	}
}
