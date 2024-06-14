import { http } from "@/connections";
import { ApiRes } from "@/types/api";
import { IGroup } from "@/types/group";

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
