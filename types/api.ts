import { NextApiRequest, NextApiResponse } from "next";
import { IUser } from "./user";

interface ApiRequest extends NextApiRequest {
	user?: IUser;
}

interface ApiResponse extends NextApiResponse {
	user?: IUser;
}

export type ApiRes<T> = { message: string; data: T };

export type T_RESPONSE_MESSAGES =
	| "SUCCESS"
	| "FAILED"
	| "BAD_REQUEST"
	| "UNAUTHORIZED"
	| "FORBIDDEN"
	| "NOT_FOUND"
	| "INTERNAL_SERVER_ERROR";

export type { ApiRequest, ApiResponse };
