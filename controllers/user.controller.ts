import {
	ApiRequest,
	ApiRequests,
	ApiResponse,
	ApiResponses,
	UpdateUser,
} from "@/types";
import { genericParse, getNonEmptyString, getString, safeParse } from "@/utils";
import { ApiFailure, ApiSuccess } from "@/server";
import { UserService } from "@/services";

export class UserController {
	public static async updateUserProfile(
		req: ApiRequest<ApiRequests.UpdateUser>,
		res: ApiResponse
	) {
		const userId = genericParse(getNonEmptyString, req.user?.id);
		const name = safeParse(getString, req.body.name);
		const phone = safeParse(getString, req.body.phone);
		const avatar = safeParse(getString, req.body.avatar);
		const body: UpdateUser = {};
		if (name !== null) body["name"] = name;
		if (phone != null) body["phone"] = phone;
		if (avatar !== null) body["avatar"] = avatar;
		const user = await UserService.updateUserDetails(userId, body);
		if (user == null) {
			return new ApiFailure(res).send();
		}
		return new ApiSuccess<ApiResponses.UpdateUser>(res).send(user);
	}
}
