import { http } from "@/connections";
import { ApiRes, IUser } from "@/types";

export const requestOtpWithEmail = async (
	email: string
): Promise<{ message: string }> => {
	const response = await http.post("/auth/otp/request", {
		email,
	});
	return response.data;
};

export const verifyOtpWithEmail = async (
	email: string,
	otp: string
): Promise<{ message: string }> => {
	const response = await http.post("/auth/otp/verify", {
		email,
		otp,
	});
	return response.data;
};

export const verifyUserIfLoggedIn = async (
	headers?: any
): Promise<ApiRes<IUser>> => {
	const response = await http.get("/auth/verify", {
		headers,
	});
	return response.data;
};

export const loginWithEmail = async (
	email: string,
	otp: string
): Promise<ApiRes<IUser>> => {
	const response = await http.post("/auth/login", {
		email,
		otp,
	});
	return response.data;
};

export const logout = async (headers?: any): Promise<{ message: string }> => {
	const response = await http.get("/auth/logout", {
		headers,
	});
	return response.data;
};
