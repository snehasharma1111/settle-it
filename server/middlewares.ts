import { admins, AuthConstants, HTTP } from "@/constants";
import { Logger } from "@/log";
import { AuthService } from "@/services";
import { ApiController, ApiRequest, ApiResponse } from "@/types";
import { genericParse, getNonEmptyString } from "@/utils";
import { ApiFailure, ApiSuccess } from "./payload";

export class ServerMiddleware {
	public static authenticatedRoute(next: ApiController): ApiController {
		return async (req: ApiRequest, res: ApiResponse) => {
			try {
				Logger.debug("cookies", req.cookies);
				const accessToken = genericParse(
					getNonEmptyString,
					req.cookies[AuthConstants.ACCESS_TOKEN]
				);
				const refreshToken = genericParse(
					getNonEmptyString,
					req.cookies[AuthConstants.REFRESH_TOKEN]
				);
				Logger.debug("Authenticating user tokens", {
					accessToken,
					refreshToken,
				});
				const authReponse = await AuthService.getAuthenticatedUser({
					accessToken,
					refreshToken,
				});
				if (!authReponse) {
					const cookies = AuthService.getCookies({
						accessToken: null,
						refreshToken: null,
						logout: true,
					});
					return new ApiFailure(res)
						.status(HTTP.status.UNAUTHORIZED)
						.message(HTTP.message.UNAUTHORIZED)
						.cookies(cookies)
						.send();
				}
				Logger.debug("Authenticated auth response", authReponse);
				const {
					user,
					accessToken: newAccessToken,
					refreshToken: newRefreshToken,
				} = authReponse;
				const cookies = AuthService.getUpdatedCookies(
					{ accessToken, refreshToken },
					{
						accessToken: newAccessToken,
						refreshToken: newRefreshToken,
					}
				);
				if (cookies.length > 0) {
					new ApiSuccess(res).cookies(cookies);
				}
				req.user = user;
				Logger.debug("Authenticated user", user);
				return next(req, res);
			} catch (error) {
				Logger.error(error);
				const cookies = AuthService.getCookies({
					accessToken: null,
					refreshToken: null,
					logout: true,
				});
				return new ApiFailure(res)
					.status(HTTP.status.UNAUTHORIZED)
					.message(HTTP.message.UNAUTHORIZED)
					.cookies(cookies)
					.send();
			}
		};
	}
	public static adminRoute(next: ApiController): ApiController {
		return async (req: ApiRequest, res: ApiResponse) => {
			try {
				const loggedInUser = req.user;
				if (!loggedInUser) {
					return res
						.status(HTTP.status.UNAUTHORIZED)
						.json({ message: "Please login to continue" });
				}
				if (!admins.includes(loggedInUser.email)) {
					return res
						.status(HTTP.status.FORBIDDEN)
						.json({ message: "You are not an admin" });
				}
				req.user = loggedInUser;
				return next(req, res);
			} catch (error) {
				Logger.error(error);
				return new ApiFailure(res)
					.status(HTTP.status.FORBIDDEN)
					.message(HTTP.message.FORBIDDEN)
					.send();
			}
		};
	}
}
