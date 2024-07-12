import { http } from "@/connections";
import { HTTP } from "@/constants";
import { admins } from "@/constants/admin";
import { authService } from "@/services/api";
import { ApiRequest, ApiResponse } from "@/types/api";
import { ServerSideAdminMiddleware } from "@/types/server";

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
		const res = await http.get("/auth/verify", {
			headers: {
				cookie: req.headers.cookie,
			},
		});
		const userDetailsRes = await http.get(`/users/${res.data.data.id}`, {
			headers: {
				cookie: req.headers.cookie,
			},
		});
		if (admins.includes(res.data.data.email)) {
			return onAdmin(userDetailsRes.data.data, {
				cookie: req.headers.cookie,
			});
		} else {
			return onNonAdmin(userDetailsRes.data.data, {
				cookie: req.headers.cookie,
			});
		}
	} catch (error: any) {
		console.error(error.message);
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
