import { AuthConstants, HTTP } from "@/constants";
import { DatabaseManager } from "@/db";
import { ApiFailure, ApiSuccess } from "@/server";
import { AuthService } from "@/services";
import { ApiRequest, ApiResponse, Cookie, IUser } from "@/types";
import { getNonEmptyString, safeParse } from "@/utils";

type HealthPayload = {
	identity: number;
	uptime: number;
	timestamp: string;
	database: boolean;
};

type HeartbeatPayload = HealthPayload & {
	user: IUser | null;
};

export class ServerController {
	public static health =
		(db: DatabaseManager) => (_: ApiRequest, res: ApiResponse) => {
			if (!db.isConnected()) {
				return new ApiFailure(res)
					.status(HTTP.status.SERVICE_UNAVAILABLE)
					.message(HTTP.message.DB_CONNECTION_ERROR)
					.send();
			}
			const payload: HealthPayload = {
				identity: process.pid,
				uptime: process.uptime(),
				timestamp: new Date().toISOString(),
				database: db.isConnected(),
			};
			return new ApiSuccess<HealthPayload>(res)
				.message(HTTP.message.HEALTHY_API)
				.send(payload);
		};
	public static heartbeat =
		(db: DatabaseManager) => async (req: ApiRequest, res: ApiResponse) => {
			const payload: HeartbeatPayload = {
				identity: process.pid,
				uptime: process.uptime(),
				timestamp: new Date().toISOString(),
				database: db.isConnected(),
				user: null,
			};
			const cookies = req.cookies;
			let updatedCookies: Array<Cookie> = [];
			if (cookies) {
				const accessToken = safeParse(
					getNonEmptyString,
					cookies?.[AuthConstants.ACCESS_TOKEN]
				);
				const refreshToken = safeParse(
					getNonEmptyString,
					cookies?.[AuthConstants.REFRESH_TOKEN]
				);
				if (accessToken && refreshToken) {
					const authResponse = await AuthService.getAuthenticatedUser(
						{
							accessToken,
							refreshToken,
						}
					);
					if (authResponse) {
						payload.user = authResponse.user;
						const {
							accessToken: newAccessToken,
							refreshToken: newRefreshToken,
						} = authResponse;
						updatedCookies = AuthService.getUpdatedCookies(
							{ accessToken, refreshToken },
							{
								accessToken: newAccessToken,
								refreshToken: newRefreshToken,
							}
						);
					}
				}
			}
			if (updatedCookies.length > 0) {
				return new ApiSuccess<HeartbeatPayload>(res)
					.message(HTTP.message.HEARTBEAT)
					.cookies(updatedCookies)
					.data(payload)
					.send();
			}
			return new ApiSuccess<HeartbeatPayload>(res)
				.message(HTTP.message.HEARTBEAT)
				.data(payload)
				.send();
		};
}
