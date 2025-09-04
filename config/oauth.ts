type GOOGLE_AUTH_KEYS =
	| "client_id"
	| "client_secret"
	| "endpoint"
	| "redirect_uri"
	| "scopes";
type GOOGLE_AUTH_CONFIG = Readonly<Record<GOOGLE_AUTH_KEYS, string>>;

export const oauth_google: GOOGLE_AUTH_CONFIG = Object.freeze({
	client_id: process.env.GOOGLE_OAUTH_CLIENT_ID || "",
	client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || "",
	endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
	redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI || "",
	scopes: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
});
