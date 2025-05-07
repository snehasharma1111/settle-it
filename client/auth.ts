import { cache, getCacheKey } from "@/cache";
import { AuthApi } from "@/connections";
import { admins, cacheParameter } from "@/constants";
import { Logger } from "@/log";
import { ServerSideAdminMiddleware, ServerSideAuthMiddleware } from "@/types";

export const authenticatedPage: ServerSideAuthMiddleware = async (
	context: any,
	{ onLoggedInAndNotOnboarded, onLoggedInAndOnboarded, onLoggedOut }
) => {
	const { req } = context;
	Logger.debug("ssr cookies", req.headers.cookie, req.cookies);
	const cookies = req.cookies;
	if (!cookies.accessToken && !cookies.refreshToken) {
		return onLoggedOut();
	}
	try {
		const headers = { cookie: req.headers.cookie };
		const cacheKey = getCacheKey(cacheParameter.USER, {
			token: cookies.accessToken,
		});
		const { data: user } = await cache.fetch(cacheKey, () =>
			AuthApi.verifyUserIfLoggedIn(headers)
		);
		if (user.name) {
			return onLoggedInAndOnboarded(user, headers);
		} else {
			return onLoggedInAndNotOnboarded(user, headers);
		}
	} catch (error: any) {
		Logger.error(error.message);
		return onLoggedOut();
	}
};

export const adminPage: ServerSideAdminMiddleware = async (
	context: any,
	{ onAdmin, onNonAdmin, onLoggedOut }
) => {
	const { req } = context;
	const cookies = req.cookies;
	if (!cookies.accessToken && !cookies.refreshToken) {
		return onLoggedOut();
	}
	try {
		const headers = { cookie: req.headers.cookie };
		const { data: user } = await AuthApi.verifyUserIfLoggedIn(headers);
		if (admins.includes(user.email)) {
			return onAdmin(user, headers);
		} else {
			return onNonAdmin(user, headers);
		}
	} catch (error: any) {
		Logger.error(error.message);
		return onLoggedOut();
	}
};
