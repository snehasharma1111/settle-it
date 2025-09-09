import { CacheParameter, T_EMAIL_TEMPLATE } from "./enum";

export type CachePayloadGenerator<T extends CacheParameter> = T extends
	| "USER"
	| "EXPENSE"
	| "GROUP"
	| "MEMBER"
	? { id: string }
	: T extends "USER_GROUPS"
		? { userId: string }
		: T extends "GROUP_EXPENSES"
			? { groupId: string }
			: never;

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
