import { ApiFailure, ApiSuccess } from "@/server";
import { AuthService } from "@/services";
import { ApiRequest, ApiRequests, ApiResponse, ApiResponses } from "@/types";

export class AuthController {
	public static async verifyLoggedInUser(
		req: ApiRequest<ApiRequests.VerifyUser>,
		res: ApiResponse
	) {
		const user = req.user;
		if (!user) {
			return new ApiFailure(res)
				.message("Please login to continue")
				.send();
		}
		return new ApiSuccess<ApiResponses.VerifyUser>(res).send(user);
	}
	public static async logout(
		_: ApiRequest<ApiRequests.Logout>,
		res: ApiResponse
	) {
		const cookies = AuthService.getCookies({
			accessToken: null,
			refreshToken: null,
			logout: true,
		});
		return new ApiSuccess<ApiResponses.Logout>(res).cookies(cookies).send();
	}
}
