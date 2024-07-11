/* eslint-disable no-unused-vars */
import NodeCache from "node-cache";
import * as constants from "@/constants/cache";

class Cache {
	private cache: NodeCache;

	constructor() {
		this.cache = new NodeCache({
			stdTTL: constants.TTL_SECONDS,
			checkperiod: constants.CHECK_INTERVAL,
			useClones: false,
			maxKeys: 2000,
		});
	}

	set(key: string, value: any, ttl: number = constants.TTL_SECONDS) {
		this.cache.set(key, value, ttl);
	}

	get(key: string) {
		return this.cache.get(key);
	}

	getAll() {
		return this.cache.keys();
	}

	del(key: string) {
		this.cache.del(key);
	}

	flushAll() {
		this.cache.flushAll();
	}

	async fetch<T>(
		key: string,
		callback: (args?: any) => Promise<T>,
		ttl: number = constants.TTL_SECONDS
	): Promise<T> {
		const cachedValue: any = this.cache.get(key);
		if (cachedValue) {
			return cachedValue;
		}
		const newValue = await callback();
		this.set(key, newValue, ttl);
		return newValue;
	}

	invalidate(key: string) {
		if (this.cache.has(key)) {
			this.cache.del(key);
		}
	}
}

declare global {
	var cache: Cache;
}

const cache = global.cache || new Cache();

export default cache;
