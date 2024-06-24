import { googleEmailConfig, jwtSecret } from "@/config";
import { http } from "@/connections";
import { HTTP } from "@/constants";
import { userService } from "@/services/api";
import { ApiRequest, ApiResponse } from "@/types/api";
import { IUser } from "@/types/user";
import { getNonEmptyString } from "@/utils/safety";
import jwt from "jsonwebtoken";

export const page = async (
	context: any,
	{
		onAdmin,
		onNonAdmin,
		onLoggedOut,
	}: {
		onAdmin: (_: IUser, __?: any) => void;
		onNonAdmin: (_: IUser, __?: any) => void;
		onLoggedOut: () => void;
	}
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
		if (res.data.data.email === googleEmailConfig.email) {
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
			const decoded: any = jwt.verify(token, jwtSecret);
			req.user = decoded;
			const userId = getNonEmptyString(decoded.id);
			const user = await userService.findById(userId);
			if (!user) {
				return res
					.status(HTTP.status.UNAUTHORIZED)
					.json({ message: "Please login to continue" });
			}
			if (user.email !== googleEmailConfig.email) {
				return res
					.status(HTTP.status.UNAUTHORIZED)
					.json({ message: "You are not authorized" });
			}
			return await next(req, res);
		} catch (err) {
			return res
				.status(HTTP.status.UNAUTHORIZED)
				.json({ message: "Token is not valid" });
		}
	};
