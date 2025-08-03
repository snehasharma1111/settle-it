import { Logger } from "@/log";

/**
 * Profiles the execution time of a given function.
 *
 * @param {function} fn - The function to be profiled.
 * @param {Array<string>} prefixes - The prefixes to be added to the log. This should commonly constitute the function name, tableId and userId and any other if required.
 * @param {...any} args - Args inferred from the function (can be optional or none).
 * @return {Promise<any>} The result of the profiled function.
 */
export const profiler = async <T extends (..._: any[]) => Promise<any>>(
	fn: T,
	prefixes: Array<string> = [],
	...args: Parameters<T>
): Promise<ReturnType<T>> => {
	const start = new Date();
	const result = await fn(...(args || []));
	const end = new Date();
	const time = end.getTime() - start.getTime();

	let str = `PROFILING ${fn.name}`;
	if (prefixes.length > 0) {
		str += ` ${prefixes.filter((s) => s.trim().length > 0).join(" ")}`;
	}

	Logger.info(str, start.toISOString(), end.toISOString(), time);
	return result;
};
