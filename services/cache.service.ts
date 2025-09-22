import { Cache } from "@/cache";
import { Logger } from "@/log";
import { cacheParameter, TTL_SECONDS } from "@/constants";
import { CacheParameter, CachePayloadGenerator } from "@/types";

export class CacheService {
	/**
	 * Fetches a value from the cache by key, or executes a callback to retrieve the value if it's not cached.
	 *
	 * @param {string} key - The cache key to fetch the value for.
	 * @param {(_?: any) => Promise<T>} callback - A callback function to execute if the value is not cached.
	 * @return {Promise<T>} The cached or newly retrieved value.
	 */
	public static async fetch<T>(
		key: string,
		callback: () => Promise<T>
	): Promise<T> {
		if (key.length > 0 && key !== "undefined" && key !== "null") {
			const cachedValue: any = Cache.get(key);
			if (cachedValue) {
				Logger.debug(`Cache hit for ${key}`);
				return cachedValue;
			}
			Logger.debug(`Cache miss for ${key}`);
			const newValue = await callback();
			Cache.set(key, newValue, TTL_SECONDS);
			return newValue;
		} else {
			return callback();
		}
	}
	public static getKey<T extends CacheParameter>(
		parameter: T,
		data: CachePayloadGenerator<T>
	): string {
		if (parameter === cacheParameter.USER) {
			if ("id" in data) {
				return `user:${data.id}`;
			}
			throw new Error("Invalid data: token is missing");
		} else if (parameter === cacheParameter.EXPENSE) {
			if ("id" in data) {
				return `expense:${data.id}`;
			}
			throw new Error("Invalid data: id is missing");
		} else if (parameter === cacheParameter.GROUP) {
			if ("id" in data) {
				return `group:${data.id}`;
			}
			throw new Error("Invalid data: id is missing");
		} else if (parameter === cacheParameter.MEMBER) {
			if ("id" in data) {
				return `member:${data.id}`;
			}
			throw new Error("Invalid data: id is missing");
		} else if (parameter === cacheParameter.USER_GROUPS) {
			if ("userId" in data) {
				return `user-groups:${data.userId}`;
			}
			throw new Error("Invalid data: userId is missing");
		} else {
			return `cache:${parameter}:${JSON.stringify(data)}`;
		}
	}

	public static invalidate(key: string) {
		Cache.invalidate(key);
	}

	public static del(key: string) {
		Cache.del(key);
	}
}
