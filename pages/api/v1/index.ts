import { server } from "@/connections";
import { apiMethods, HTTP } from "@/constants";
import { logger } from "@/log";
import { ApiRequest, ApiResponse, T_API_METHODS } from "@/types";
import { genericParse, getNonEmptyString } from "@/utils";
import { NextApiHandler } from "next";

const getCallMethod = (method: T_API_METHODS) => {
	switch (method) {
		case apiMethods.GET:
			return server.get;
		case apiMethods.POST:
			return server.post;
		case apiMethods.PUT:
			return server.put;
		case apiMethods.PATCH:
			return server.patch;
		case apiMethods.DELETE:
			return server.delete;
		default:
			return server.get;
	}
};

const callApi = async (
	method: T_API_METHODS,
	endpoint: string,
	body: any,
	{ headers }: { headers: any }
) => {
	const callMethod = getCallMethod(method);
	if (method === apiMethods.GET || method === apiMethods.DELETE) {
		return callMethod(endpoint, { headers });
	} else {
		return callMethod(endpoint, body, { headers });
	}
};

const handler: NextApiHandler = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const headers = { cookie: req.headers.cookie };
		const method = genericParse(
			getNonEmptyString<T_API_METHODS>,
			req.method
		);
		const endpoint = getNonEmptyString(req.headers["x-endpoint"]);
		const body = req.body || {};
		logger.debug("proxy route", method, endpoint, body, headers);
		const response = await callApi(method, endpoint, body, { headers });
		if (endpoint === "/auth/logout") {
			res.setHeader(
				"Set-Cookie",
				"token=; HttpOnly; Path=/; Max-Age=-1; SameSite=None; Secure=true;"
			);
		} else {
			const token = response.headers?.["x-auth-token"];
			if (token) {
				logger.debug("token", token);
				res.setHeader(
					"Set-Cookie",
					`token=${token}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60 * 1000}; SameSite=None; Secure=true;`
				);
			}
		}
		return res.status(response.status).json(response.data);
	} catch (err: any) {
		logger.error(err);
		return res
			.status(err?.response?.status || HTTP.status.INTERNAL_SERVER_ERROR)
			.json(
				err?.response?.data || {
					message: HTTP.message.INTERNAL_SERVER_ERROR,
				}
			);
	}
};

export default handler;
