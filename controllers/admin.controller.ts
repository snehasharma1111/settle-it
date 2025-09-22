import {
	CacheService,
	FilesService,
	GroupService,
	UserService,
} from "@/services";
import { ApiRequest, ApiResponse, IGroup, IUser } from "@/types";
import { ApiFailure, ApiSuccess } from "@/server";
import { HTTP, logsBaseUrl } from "@/constants";
import { fileBasedStorage, getNonEmptyString } from "@/utils";

export class AdminController {
	public static async getAllGroups(_: ApiRequest, res: ApiResponse) {
		const groups = await GroupService.getAllGroups();
		return new ApiSuccess<Array<IGroup>>(res).data(groups).send();
	}

	public static async getAllUsers(_: ApiRequest, res: ApiResponse) {
		const users = await UserService.getAllUsers();
		return new ApiSuccess<Array<IUser>>(res).data(users).send();
	}

	public static getAllCacheData(_: ApiRequest, res: ApiResponse) {
		const cacheData = CacheService.getAllCacheData();
		return new ApiSuccess<Array<any>>(res).data(cacheData).send();
	}

	public static clearAllCacheData(_: ApiRequest, res: ApiResponse) {
		CacheService.clearAllCacheData();
		return new ApiSuccess(res).send();
	}

	public static getAllLogFiles(_: ApiRequest, res: ApiResponse) {
		const files = FilesService.getLogFiles();
		return new ApiSuccess<Array<string>>(res).data(files).send();
	}

	public static async getLogFileByName(req: ApiRequest, res: ApiResponse) {
		const name = getNonEmptyString(req.body.name);
		const fileContent = FilesService.getLogFileByName(name);
		return new ApiSuccess<string>(res).data(fileContent).send();
	}
}
