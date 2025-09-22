import { AuthConstants, HTTP } from "@/constants";
import { Logger } from "@/log";
import { AuthService, GroupService } from "@/services";
import { ApiController, ApiRequest, ApiResponse } from "@/types";
import {
	genericParse,
	getNonEmptyString,
	getSearchParam,
	safeParse,
} from "@/utils";
import { ApiFailure, ApiSuccess } from "./payload";

export class ServerMiddleware {
	public static authenticatedRoute(next: ApiController): ApiController {
		return async (req: ApiRequest, res: ApiResponse) => {
			try {
				Logger.debug("authRoute -> url, cookies", req.url, req.cookies);
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
				const authResponse = await AuthService.getAuthenticatedUser({
					accessToken,
					refreshToken,
				});
				Logger.debug("authResponse", authResponse);
				if (!authResponse) {
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
				Logger.debug("Authenticated auth response", authResponse);
				const {
					user,
					accessToken: newAccessToken,
					refreshToken: newRefreshToken,
				} = authResponse;
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
			return next(req, res);
		};
	}

	public static adminRoute(next: ApiController): ApiController {
		return async (req: ApiRequest, res: ApiResponse) => {
			try {
				const loggedInUser = req.user;
				if (!loggedInUser) {
					return new ApiFailure(res)
						.status(HTTP.status.UNAUTHORIZED)
						.message(HTTP.message.UNAUTHORIZED)
						.send();
				}
				if (!AuthConstants.admins.includes(loggedInUser.email)) {
					return new ApiFailure(res)
						.status(HTTP.status.FORBIDDEN)
						.message("You are not an admin")
						.send();
				}
				req.user = loggedInUser;
			} catch (error) {
				Logger.error(error);
				return new ApiFailure(res)
					.status(HTTP.status.FORBIDDEN)
					.message(HTTP.message.FORBIDDEN)
					.send();
			}
			return next(req, res);
		};
	}

	public static isGroupMember(next: ApiController): ApiController {
		return async (req: ApiRequest, res: ApiResponse) => {
			try {
				Logger.debug("isGroupMember -> url, user", req.url, req.user);
				const loggedInUser = req.user;
				if (!loggedInUser) {
					return new ApiFailure(res)
						.status(HTTP.status.UNAUTHORIZED)
						.message(HTTP.message.UNAUTHORIZED)
						.send();
				}
				let groupId = safeParse(
					getNonEmptyString,
					getSearchParam(req.url, "groupId")
				);
				if (groupId == null) {
					groupId = safeParse(
						getNonEmptyString,
						getSearchParam(req.url, "id")
					);
				}
				if (groupId == null) {
					return new ApiFailure(res)
						.status(HTTP.status.BAD_REQUEST)
						.message("Group ID is required")
						.send();
				}
				const group = await GroupService.getGroupDetailsForUser(
					loggedInUser.id,
					groupId
				);
				if (!group) {
					return new ApiFailure(res)
						.status(HTTP.status.FORBIDDEN)
						.message("You are not a member of this group")
						.send();
				}
				req.group = group;
			} catch (error) {
				Logger.error(error);
				return new ApiFailure(res)
					.status(HTTP.status.FORBIDDEN)
					.message(HTTP.message.FORBIDDEN)
					.send();
			}
			return next(req, res);
		};
	}
}
