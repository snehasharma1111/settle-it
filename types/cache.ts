export type CacheParameter =
	| "USER"
	| "EXPENSE"
	| "GROUP"
	| "MEMBER"
	| "USER_GROUPS";

export type CachePayloadGenerator<T extends CacheParameter> = T extends
	| "USER"
	| "EXPENSE"
	| "GROUP"
	| "MEMBER"
	? { id: string }
	: T extends "USER_GROUPS"
		? { userId: string }
		: never;
