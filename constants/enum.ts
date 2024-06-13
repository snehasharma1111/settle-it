import { T_USER_STATUS, T_OTP_STATUS, T_EXPENSE_STATUS } from "@/types/user";
import { getEnumeration } from "@/utils/functions";

export const USER_STATUS = getEnumeration<T_USER_STATUS>(["INVITED", "JOINED"]);
export const OTP_STATUS = getEnumeration<T_OTP_STATUS>([
	"PENDING",
	"VERIFIED",
	"EXPIRED",
]);
export const EXPENSE_STATUS = getEnumeration<T_EXPENSE_STATUS>([
	"PENDING",
	"SETTLED",
]);

const message = {
	SUCCESS: "Success",
	ERROR: "Error",
	NOT_FOUND: "Not Found",
	BAD_REQUEST: "Bad Request",
	UNAUTHORIZED: "Unauthorized",
	FORBIDDEN: "Forbidden",
	INTERNAL_SERVER_ERROR: "Internal Server Error",
};

const status = {
	SUCCESS: 200,
	CREATED: 201,
	REMOVED: 204,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	INTERNAL_SERVER_ERROR: 500,
};

export const HTTP = {
	status,
	message,
};
