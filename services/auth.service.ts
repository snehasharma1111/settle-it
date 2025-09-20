import { jwtSecret } from "@/config";
import { AuthConstants } from "@/constants";
import { Logger } from "@/log";
import { authRepo } from "@/repo";
import { AuthResponse, Cookie, IAuthMapping, IUser, Tokens } from "@/types";
import { genericParse, getNonEmptyString } from "@/utils";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export class AuthService {
	public static async findOrCreateAuthMapping(
		email: string,
		provider: { id: string; name: string },
		user: string | null = null,
		misc: any = {}
	): Promise<IAuthMapping> {
		const foundAuthMapping = await authRepo.findOne({
			identifier: email,
			providerName: provider.name,
		});
		if (foundAuthMapping) {
			return foundAuthMapping;
		}
		return await authRepo.create({
			identifier: email,
			providerName: provider.name,
			providerId: provider.id,
			misc: JSON.stringify(misc),
			user,
		});
	}
	public static async getUserByAuthMappingId(
		authMappingId: string
	): Promise<IUser | null> {
		const foundAuthMapping = await authRepo.findById(authMappingId);
		if (!foundAuthMapping) return null;
		Logger.debug("foundAuthMapping", foundAuthMapping);
		return foundAuthMapping.user;
	}
	public static async getAuthenticatedUser({
		accessToken,
		refreshToken,
	}: Tokens): Promise<(AuthResponse & Tokens) | null> {
		try {
			const decodedAccessToken: any = jwt.verify(
				accessToken,
				jwtSecret.authAccess
			);
			const authMappingId = genericParse(
				getNonEmptyString,
				decodedAccessToken.id
			);
			Logger.debug(
				"getAuthenticatedUser -> authMappingId by accessToken",
				authMappingId
			);
			const user =
				await AuthService.getUserByAuthMappingId(authMappingId);
			if (!user) return null;
			Logger.debug("getAuthenticatedUser -> user by accessToken", user);
			const tokens: Tokens = { accessToken, refreshToken };
			const cookies = AuthService.getCookies(tokens);
			return {
				user,
				cookies,
				...tokens,
			};
		} catch (error) {
			if (
				!(error instanceof TokenExpiredError) &&
				!(error instanceof JsonWebTokenError)
			) {
				return null;
			}
		}
		try {
			const decodedRefreshToken: any = jwt.verify(
				refreshToken,
				jwtSecret.authRefresh
			);
			const authMappingId = genericParse(
				getNonEmptyString,
				decodedRefreshToken.id
			);
			Logger.debug(
				"getAuthenticatedUser -> authMappingId by refreshToken",
				authMappingId
			);
			const user =
				await AuthService.getUserByAuthMappingId(authMappingId);
			if (!user) return null;
			Logger.debug("getAuthenticatedUser -> user by refreshToken", user);
			const newAccessToken =
				AuthService.generateAccessToken(authMappingId);
			const newRefreshToken =
				AuthService.generateRefreshToken(authMappingId);
			const tokens: Tokens = {
				accessToken: newAccessToken,
				refreshToken: newRefreshToken,
			};
			const cookies = AuthService.getCookies(tokens);
			return {
				user,
				cookies,
				...tokens,
			};
		} catch {
			return null;
		}
	}
	public static generateRefreshToken(id: string) {
		return jwt.sign({ id }, jwtSecret.authRefresh, {
			expiresIn: "7d",
		});
	}
	public static generateAccessToken(id: string) {
		return jwt.sign({ id }, jwtSecret.authAccess, {
			expiresIn: "1m",
		});
	}
	public static generateTokens(id: string): {
		refreshToken: string;
		accessToken: string;
	} {
		return {
			refreshToken: AuthService.generateRefreshToken(id),
			accessToken: AuthService.generateAccessToken(id),
		};
	}
	public static getCookies({
		accessToken,
		refreshToken,
		logout,
	}: {
		accessToken: string | null;
		refreshToken: string | null;
		logout?: boolean;
	}): Array<Cookie> {
		const cookiesToSet: Array<Cookie> = [];
		if (logout) {
			cookiesToSet.push({
				name: AuthConstants.ACCESS_TOKEN,
				value: "",
				maxAge: -1,
			});
			cookiesToSet.push({
				name: AuthConstants.REFRESH_TOKEN,
				value: "",
				maxAge: -1,
			});
			return cookiesToSet;
		}
		if (accessToken) {
			cookiesToSet.push({
				name: AuthConstants.ACCESS_TOKEN,
				value: accessToken,
				maxAge: AuthConstants.COOKIES_EXPIRY,
			});
		}
		if (refreshToken) {
			cookiesToSet.push({
				name: AuthConstants.REFRESH_TOKEN,
				value: refreshToken,
				maxAge: AuthConstants.COOKIES_EXPIRY,
			});
		}
		return cookiesToSet;
	}
	public static getUpdatedCookies(old: Tokens, newTokens: Tokens) {
		const cookiesToSet = [];
		if (old.accessToken !== newTokens.accessToken) {
			cookiesToSet.push({
				name: AuthConstants.ACCESS_TOKEN,
				value: newTokens.accessToken,
				maxAge: AuthConstants.COOKIES_EXPIRY,
			});
		}
		if (old.refreshToken !== newTokens.refreshToken) {
			cookiesToSet.push({
				name: AuthConstants.REFRESH_TOKEN,
				value: newTokens.refreshToken,
				maxAge: AuthConstants.COOKIES_EXPIRY,
			});
		}
		return cookiesToSet;
	}
}
