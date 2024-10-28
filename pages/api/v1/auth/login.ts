import { http } from "@/connections";
import { HTTP } from "@/constants";
import { logger } from "@/log";
import { ApiRequest, ApiResponse } from "@/types";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req: ApiRequest, res: ApiResponse) => {
	try {
		logger.debug("Proxying to server", req.method, req.body);
		const response = await http.post("/auth/login", req.body);
		logger.debug(
			"Response from server",
			response.data,
			response.headers,
			response.status
		);
		const token = response.headers["x-auth-token"];
		res.setHeader(
			"Set-Cookie",
			`token=${token}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60 * 1000}; SameSite=None; Secure=true; Partitioned=true`
		);
		return res.status(response.status).json(response.data);
	} catch (error: any) {
		logger.error(
			"Error from server",
			error,
			error.message,
			error.response,
			error.data
		);
		return res
			.status(
				error?.response?.status || HTTP.status.INTERNAL_SERVER_ERROR
			)
			.json(
				error?.response?.data || {
					message: HTTP.message.INTERNAL_SERVER_ERROR,
				}
			);
	}
};

export default handler;
