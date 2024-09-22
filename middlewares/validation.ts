import { HTTP, regex } from "@/constants";
import { logger } from "@/log";
import { ApiRequest, ApiResponse } from "@/types";
import { getNonEmptyString, safeParse } from "@/utils";

export const email =
	(next: Function) => async (req: ApiRequest, res: ApiResponse) => {
		try {
			const email = safeParse(getNonEmptyString, req.body.email);
			if (!email)
				return res
					.status(HTTP.status.BAD_REQUEST)
					.json({ message: "Email is required" });
			if (!regex.email.test(email))
				return res
					.status(HTTP.status.BAD_REQUEST)
					.json({ message: "Invalid email provided" });
			await next(req, res);
		} catch (error: any) {
			logger.error(error);
			if (error.message.toLowerCase().startsWith("invalid input")) {
				return res
					.status(HTTP.status.BAD_REQUEST)
					.json({ message: "Please provide a valid email" });
			}
			return res
				.status(HTTP.status.INTERNAL_SERVER_ERROR)
				.json({ message: "Internal Server Error" });
		}
	};

export const password =
	(next: Function) => async (req: ApiRequest, res: ApiResponse) => {
		try {
			const password = safeParse(getNonEmptyString, req.body.password);
			if (!password)
				return res
					.status(HTTP.status.BAD_REQUEST)
					.json({ message: "Password is required" });
			if (password.length < 6)
				return res.status(HTTP.status.BAD_REQUEST).json({
					message: "Password should be atleast 6 characters long",
				});
			await next(req, res);
		} catch (error: any) {
			logger.error(error);
			if (error.message.toLowerCase().startsWith("invalid input")) {
				return res
					.status(HTTP.status.BAD_REQUEST)
					.json({ message: "Please provide a valid password" });
			}
			return res
				.status(HTTP.status.INTERNAL_SERVER_ERROR)
				.json({ message: "Internal Server Error" });
		}
	};

export const phone =
	(next: Function) => async (req: ApiRequest, res: ApiResponse) => {
		try {
			const phone = safeParse(getNonEmptyString, req.body.phone);
			if (!phone)
				return res
					.status(HTTP.status.BAD_REQUEST)
					.json({ message: "Phone is required" });
			if (!regex.phone.test(phone))
				return res
					.status(HTTP.status.BAD_REQUEST)
					.json({ message: "Invalid phone provided" });
			await next(req, res);
		} catch (error: any) {
			logger.error(error);
			if (error.message.toLowerCase().startsWith("invalid input")) {
				return res
					.status(HTTP.status.BAD_REQUEST)
					.json({ message: "Please provide a valid phone" });
			}
			return res
				.status(HTTP.status.INTERNAL_SERVER_ERROR)
				.json({ message: "Internal Server Error" });
		}
	};
