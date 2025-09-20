import { cacheParameter, CHECK_INTERVAL, TTL_SECONDS } from "@/constants";
import { Logger } from "@/log";
import { CacheParameter, CachePayloadGenerator } from "@/types";
import NodeCache from "node-cache";

class CacheService {
	private cache: NodeCache;

	constructor() {
		this.cache = new NodeCache({
			stdTTL: TTL_SECONDS,
			checkperiod: CHECK_INTERVAL,
			useClones: false,
			maxKeys: 2000,
		});
		global.cache = this;
	}

	public set(key: string, value: any, ttl: number = TTL_SECONDS) {
		this.cache.set(key, value, ttl);
	}

	public get(key: string) {
		return this.cache.get(key);
	}

	public getAll() {
		return this.cache.keys();
	}

	public del(key: string) {
		this.cache.del(key);
	}

	public flushAll() {
		this.cache.flushAll();
	}

	/**
	 * Fetches a value from the cache by key, or executes a callback to retrieve the value if it's not cached.
	 *
	 * @param {string} key - The cache key to fetch the value for.
	 * @param {(_?: any) => Promise<T>} callback - A callback function to execute if the value is not cached.
	 * @return {Promise<T>} The cached or newly retrieved value.
	 */
	public async fetch<T>(key: string, callback: () => Promise<T>): Promise<T> {
		if (
			typeof key === "string" &&
			key.length > 0 &&
			key !== "undefined" &&
			key !== "null"
		) {
			const cachedValue: any = this.cache.get(key);
			if (cachedValue) {
				Logger.debug(`Cache hit for ${key}`);
				return cachedValue;
			}
			Logger.debug(`Cache miss for ${key}`);
			const newValue = await callback();
			this.set(key, newValue, TTL_SECONDS);
			return newValue;
		} else {
			return callback();
		}
	}

	public invalidate(key: string) {
		if (this.cache.has(key)) {
			this.cache.del(key);
		}
	}
	public getKey<T extends CacheParameter>(
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
}

declare global {
	// eslint-disable-next-line no-unused-vars
	var cache: CacheService;
}

export const Cache = global.cache || new CacheService();
