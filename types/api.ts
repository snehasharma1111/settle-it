import { NextApiRequest, NextApiResponse } from "next";
import { IUser } from "./user";

export interface ApiRequest extends NextApiRequest {
	user?: IUser;
}

export interface ApiResponse extends NextApiResponse {
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

export type ApiControllers = {
	GET?: any;
	POST?: any;
	PUT?: any;
	PATCH?: any;
	DELETE?: any;
};

export type ApiController = (_: ApiRequest, __: ApiResponse) => any;

export type ApiWrapperOptions = {
	db?: boolean;
	auth?: boolean;
	admin?: boolean;
};

export type T_API_METHODS = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
