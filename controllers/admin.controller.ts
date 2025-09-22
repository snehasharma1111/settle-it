import { CacheService, GroupService, UserService } from "@/services";
import { ApiRequest, ApiResponse, IGroup, IUser } from "@/types";
import { ApiFailure, ApiSuccess } from "@/server";
import { HTTP, logsBaseUrl } from "@/constants";
import { fileBasedStorage, getNonEmptyString, getSearchParam } from "@/utils";

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
		const dir = logsBaseUrl;
		const fs = fileBasedStorage();
		if (!fs) {
			return new ApiFailure(res)
				.status(HTTP.status.SERVICE_UNAVAILABLE)
				.message("File based storage not available")
				.send();
		}
		if (!fs.existsSync(dir)) {
			return new ApiFailure(res)
				.status(HTTP.status.NOT_FOUND)
				.message("No log files found")
				.send();
		}
		const files = fs.readdirSync(dir);
		if (files.length === 0) {
			return new ApiFailure(res)
				.status(HTTP.status.NOT_FOUND)
				.message("No log files found")
				.send();
		}
		return new ApiSuccess<Array<string>>(res).data(files).send();
	}

	public static async getLogFileByName(req: ApiRequest, res: ApiResponse) {
		const name = getNonEmptyString(req.body.name);
		if (!name) {
			return new ApiFailure(res)
				.status(HTTP.status.BAD_REQUEST)
				.message("Log file name is required")
				.send();
		}
		const fs = fileBasedStorage();
		if (!fs) {
			return new ApiFailure(res)
				.status(HTTP.status.SERVICE_UNAVAILABLE)
				.message("File based storage not available")
				.send();
		}
		const filePath = `${logsBaseUrl}/${name}`;
		if (!fs.existsSync(filePath)) {
			return new ApiFailure(res)
				.status(HTTP.status.NOT_FOUND)
				.message("Log file not found")
				.send();
		}
		const fileContent = fs.readFileSync(filePath, "utf-8");
		return new ApiSuccess<string>(res).data(fileContent).send();
	}
}
