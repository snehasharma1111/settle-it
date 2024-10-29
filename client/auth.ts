import { api } from "@/connections";
import { admins } from "@/constants";
import { logger } from "@/log";
import { ServerSideAdminMiddleware, ServerSideAuthMiddleware } from "@/types";

export const authenticatedPage: ServerSideAuthMiddleware = async (
	context: any,
	{ onLoggedInAndNotOnboarded, onLoggedInAndOnboarded, onLoggedOut }
) => {
	const { req } = context;
	logger.debug("ssr cookies", req.headers.cookie, req.cookies);
	const cookies = req.cookies;
	if (!cookies.token) {
		return onLoggedOut();
	}
	try {
		const headers = { cookie: req.headers.cookie };
		const { data: user } = await api.auth.verifyUserIfLoggedIn(headers);
		if (user.name && user.phone) {
			return onLoggedInAndOnboarded(user, headers);
		} else {
			return onLoggedInAndNotOnboarded(user, headers);
		}
	} catch (error: any) {
		logger.error(error.message);
		return onLoggedOut();
	}
};

export const adminPage: ServerSideAdminMiddleware = async (
	context: any,
	{ onAdmin, onNonAdmin, onLoggedOut }
) => {
	const { req } = context;
	const cookies = req.cookies;
	if (!cookies.token) {
		return onLoggedOut();
	}
	try {
		const headers = { cookie: req.headers.cookie };
		const { data: user } = await api.auth.verifyUserIfLoggedIn(headers);
		if (admins.includes(user.email)) {
			return onAdmin(user, headers);
		} else {
			return onNonAdmin(user, headers);
		}
	} catch (error: any) {
		logger.error(error.message);
		return onLoggedOut();
	}
};
