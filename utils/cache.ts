import { getEnumeration } from "@/utils/functions";

type CacheParameter = "USER" | "USER_GROUPS" | "GROUP_EXPENSES";

export const cacheParameter = getEnumeration<CacheParameter>([
	"USER",
	"USER_GROUPS",
	"GROUP_EXPENSES",
]);

export const getCacheKey = (parameter: CacheParameter, data: any) => {
	switch (parameter) {
		case "USER":
			return `user:${data.id}`;
		case "USER_GROUPS":
			return `user:${data.userId}:groups`;
		case "GROUP_EXPENSES":
			return `group:${data.groupId}:expenses`;
		default:
			return `cache:${parameter}:${JSON.stringify(data)}`;
	}
};
