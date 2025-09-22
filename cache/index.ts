import { cacheParameter, CHECK_INTERVAL, TTL_SECONDS } from "@/constants";
import { Logger } from "@/log";
import { CacheParameter, CachePayloadGenerator } from "@/types";
import NodeCache from "node-cache";

class CacheFactory {
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

	public set<T>(key: string, value: T, ttl: number = TTL_SECONDS) {
		this.cache.set<T>(key, value, ttl);
	}

	public get<T>(key: string) {
		return this.cache.get<T>(key);
	}

	public getAllKeys() {
		return this.cache.keys();
	}

	public del(key: string) {
		return this.cache.del(key);
	}

	public flushAll() {
		this.cache.flushAll();
	}

	public invalidate(key: string) {
		if (this.cache.has(key)) {
			this.cache.del(key);
		}
	}
}

declare global {
	// eslint-disable-next-line no-unused-vars
	var cache: CacheFactory;
}

export const Cache = global.cache || new CacheFactory();
