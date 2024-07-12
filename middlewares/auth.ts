import { jwtSecret } from "@/config";
import { http } from "@/connections";
import { HTTP } from "@/constants";
import { ApiRequest, ApiResponse } from "@/types/api";
import { ServerSideAuthMiddleware } from "@/types/server";
import jwt from "jsonwebtoken";

export const page: ServerSideAuthMiddleware = async (
	context: any,
	{ onLoggedInAndNotOnboarded, onLoggedInAndOnboarded, onLoggedOut }
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
		if (res.data.data.name && res.data.data.phone) {
			return onLoggedInAndOnboarded(res.data.data, {
				cookie: req.headers.cookie,
			});
		} else {
			return onLoggedInAndNotOnboarded(res.data.data, {
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
			const decoded: any = jwt.verify(token, jwtSecret);
			req.user = decoded;
			return await next(req, res);
		} catch (err) {
			return res
				.status(HTTP.status.UNAUTHORIZED)
				.json({ message: "Token is not valid" });
		}
	};
