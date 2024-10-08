import { admins, HTTP } from "@/constants";
import { authService } from "@/services";
import { ApiController, ApiRequest, ApiResponse } from "@/types";

export const authenticated =
	(next: ApiController) => async (req: ApiRequest, res: ApiResponse) => {
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
			req.user = loggedInUser;
			return await next(req, res);
		} catch (err) {
			return res
				.status(HTTP.status.UNAUTHORIZED)
				.json({ message: "Token is not valid" });
		}
	};

export const adminRoute =
	(next: ApiController) => async (req: ApiRequest, res: ApiResponse) => {
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
