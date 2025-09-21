import { GroupService, UserService } from "@/services";
import { ApiRequest, ApiResponse, IGroup, IUser } from "@/types";
import { ApiSuccess } from "@/server";

export class AdminController {
	public static async getAllGroups(_: ApiRequest, res: ApiResponse) {
		const groups = await GroupService.getAllGroups();
		return new ApiSuccess<Array<IGroup>>(res).data(groups).send();
	}
	public static async getAllUsers(_: ApiRequest, res: ApiResponse) {
		const users = await UserService.getAllUsers();
		return new ApiSuccess<Array<IUser>>(res).data(users).send();
	}
}
