import { CacheParameter, T_EMAIL_TEMPLATE } from "./enum";

type CachePayloadMap = {
	USER: { id: string } | { email: string };
	AUTH_MAPPING: { id: string } | { identifier: string; provider: string };
	EXPENSE: { id: string };
	GROUP: { id: string };
	MEMBER: { id: string };
	USER_GROUPS: { userId: string };
	GROUP_EXPENSES: { groupId: string };
};
export type CachePayloadGenerator<T extends CacheParameter> =
	CachePayloadMap[T];

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
