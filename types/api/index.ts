import { NextApiRequest, NextApiResponse } from "next";
import { IUser } from "../user";

export * as ApiRequests from "./requests";
export * as ApiResponses from "./responses";

export type ApiRequest<T = any> = Omit<NextApiRequest, "body"> & {
	body: T;
	user?: IUser;
};
export type ApiResponse = NextApiResponse;

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

export type ApiController = (_: ApiRequest, __: ApiResponse) => Promise<void>;

export type ApiWrapperOptions = {
	db?: boolean;
	auth?: boolean;
	admin?: boolean;
};

export type T_API_METHODS = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
