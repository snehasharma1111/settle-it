export type T_USER_STATUS = "JOINED" | "INVITED";
export type T_OTP_STATUS = "PENDING" | "EXPIRED";
export type T_EXPENSE_STATUS = "PENDING" | "SETTLED";

export type T_EMAIL_TEMPLATE =
	| "OTP"
	| "NEW_USER_ONBOARDED"
	| "USER_INVITED"
	| "USER_ADDED_TO_GROUP";

export type CacheParameter =
	| "USER"
	| "EXPENSE"
	| "GROUP"
	| "MEMBER"
	| "USER_GROUPS"
	| "GROUP_EXPENSES";
