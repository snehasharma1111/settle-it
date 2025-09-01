export type T_OTP_STATUS = "PENDING" | "EXPIRED";
export type T_EMAIL_TEMPLATE =
	| "OTP"
	| "NEW_USER_ONBOARDED"
	| "USER_INVITED"
	| "USER_ADDED_TO_GROUP";

export type EmailTemplateGenerator<T extends T_EMAIL_TEMPLATE> = T extends "OTP"
	? { otp: string }
	: T extends "USER_INVITED"
		? { invitedBy: { name: string; email: string } }
		: T extends "USER_ADDED_TO_GROUP"
			? {
					invitedBy: { name: string; email: string };
					group: { id: string; name: string };
				}
			: never;
