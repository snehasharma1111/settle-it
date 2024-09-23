import { api } from "@/connections";
import { admins, HTTP } from "@/constants";
import { logger } from "@/log";
import { authService } from "@/services";
import { ApiRequest, ApiResponse, ServerSideAdminMiddleware } from "@/types";

export const page: ServerSideAdminMiddleware = async (
	context: any,
	{ onAdmin, onNonAdmin, onLoggedOut }
) => {
	const { req } = context;
	const cookies = req.cookies;
	if (!cookies.token) {
		return onLoggedOut();
	}
	try {
		const headers = { cookie: req.headers.cookie };
		const { data: user } = await api.auth.verifyUserIfLoggedIn(headers);
		if (admins.includes(user.email)) {
			return onAdmin(user, headers);
		} else {
			return onNonAdmin(user, headers);
		}
	} catch (error: any) {
		logger.error(error.message);
		return onLoggedOut();
	}
};

export const apiRoute =
	(next: Function) => async (req: ApiRequest, res: ApiResponse) => {
		const token = req.cookies.token;
		if (!token) {
			return res
				.status(HTTP.status.UNAUTHORIZED)
				.json({ message: "Please login to continue" });
		}
		try {
			const loggedInUser = await authService.authenticate(token);
			if (!loggedInUser) {
				return res
					.status(HTTP.status.UNAUTHORIZED)
					.json({ message: "Please login to continue" });
			}
			if (!admins.includes(loggedInUser.email)) {
				return res
					.status(HTTP.status.FORBIDDEN)
					.json({ message: "You are not authorized" });
			}
			req.user = loggedInUser;
			return await next(req, res);
		} catch (err) {
			return res
				.status(HTTP.status.UNAUTHORIZED)
				.json({ message: "Token is not valid" });
		}
	};
