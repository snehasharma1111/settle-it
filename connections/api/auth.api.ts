import { http } from "@/connections";
import { logger } from "@/messages";
import { IUser } from "@/types/user";

export const requestOtpWithEmail = async (
	email: string
): Promise<{
	message: string;
}> => {
	try {
		const response = await http.post("/auth/otp/request", {
			email,
		});
		return Promise.resolve(response.data);
	} catch (error: any) {
		logger.error(error);
		return Promise.reject(error?.response?.data);
	}
};

export const verifyOtpWithEmail = async (
	email: string,
	otp: string
): Promise<{ message: string }> => {
	try {
		const response = await http.post("/auth/otp/verify", {
			email,
			otp,
		});
		return Promise.resolve(response.data);
	} catch (error: any) {
		logger.error(error);
		return Promise.reject(error.response.data);
	}
};

export const verifyUserIfLoggedIn = async (): Promise<{
	message: string;
	data: IUser;
}> => {
	try {
		const response = await http.get("/auth/verify");
		return Promise.resolve(response.data);
	} catch (error: any) {
		logger.error(error);
		return Promise.reject(error.response.data);
	}
};

export const loginWithEmail = async (
	email: string,
	otp: string
): Promise<{
	message: string;
	data: IUser;
}> => {
	try {
		const response = await http.post("/auth/login", {
			email,
			otp,
		});
		return Promise.resolve(response.data);
	} catch (error: any) {
		logger.error(error);
		return Promise.reject(error.response.data);
	}
};

export const logout = async (
	headers?: any
): Promise<{
	message: string;
}> => {
	try {
		const response = await http.get("/auth/logout", {
			headers,
		});
		return Promise.resolve(response.data);
	} catch (error: any) {
		logger.error(error);
		return Promise.reject(error.response.data);
	}
};
