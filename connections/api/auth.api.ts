import { http } from "@/connections";
import { ApiRes, IUser } from "@/types";

export class AuthApi {
	public static async requestOtpWithEmail(
		email: string
	): Promise<{ message: string }> {
		const response = await http.post("/auth/otp/request", {
			email,
		});
		return response.data;
	}

	public static async verifyOtpWithEmail(
		email: string,
		otp: string
	): Promise<ApiRes<IUser>> {
		const response = await http.post("/auth/otp/verify", {
			email,
			otp,
		});
		return response.data;
	}

	public static async verifyUserIfLoggedIn(
		headers?: any
	): Promise<ApiRes<IUser>> {
		const response = await http.get("/auth/verify", {
			headers,
		});
		return response.data;
	}

	public static async logout(headers?: any): Promise<{ message: string }> {
		const response = await http.get("/auth/logout", {
			headers,
		});
		return response.data;
	}
}
