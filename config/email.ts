type GOOGLE_MAIL_SERVICE_KEYS = "email" | "password";

export const googleEmailConfig: Record<GOOGLE_MAIL_SERVICE_KEYS, string> = {
	email: process.env.GOOGLE_EMAIL || "",
	password: process.env.GOOGLE_EMAIL_PASSWORD || "",
};
