/* eslint-disable no-console */
import { enableDebugging, nodeEnv } from "@/config";
import { logsBaseUrl, serviceName } from "@/constants";
import { fileBasedStorage } from "@/utils";

type LOG_LEVEL =
	| "log"
	| "info"
	| "warn"
	| "error"
	| "debug"
	| "verbose"
	| "silly"
	| "http";

export class Logger {
	private static getTimestamp() {
		const date = new Date();
		return date.toISOString();
	}
	private static getLevel(level: LOG_LEVEL) {
		return level.toUpperCase();
	}
	private static getConsoleColor(level: LOG_LEVEL) {
		switch (level) {
			case "info":
				return "\x1b[32m%s\x1b[37m";
			case "warn":
				return "\x1b[33m%s\x1b[0m";
			case "error":
				return "\x1b[31m%s\x1b[0m";
			case "debug":
				return "\x1b[34m%s\x1b[0m";
			case "verbose":
				return "\x1b[35m%s\x1b[0m";
			case "silly":
				return "\x1b[36m%s\x1b[0m";
			case "http":
				return "\x1b[35m%s\x1b[0m";
			default:
				return "\x1b[37m%s\x1b[0m";
		}
	}
	private static getConsoleMethod(level: LOG_LEVEL) {
		switch (level) {
			case "info":
				return console.info;
			case "warn":
				return console.warn;
			case "error":
				return console.error;
			case "debug":
				return console.debug;
			case "verbose":
				return console.log;
			case "silly":
				return console.log;
			case "http":
				return console.log;
			default:
				return console.log;
		}
	}
	private static getMessage(...messages: Array<any>): string {
		const message = messages
			.map((m) => {
				if (m === null) return "null";
				if (m === undefined) return "undefined";
				if (typeof m === "string") return `"${m}"`;
				if (typeof m === "object") return JSON.stringify(m);
				else return m;
			})
			.map((m) => m.toString());
		return `${message}`;
	}
	private static getMessageToLog(level: LOG_LEVEL, ...messages: Array<any>) {
		const timestamp = Logger.getTimestamp();
		const logLevel = Logger.getLevel(level);
		const message = Logger.getMessage(...messages);
		const service = `${serviceName}-${nodeEnv}`;
		return `[${service}] [${timestamp}] [${logLevel}] [${message}]\n`;
	}
	private static writeToConsole(level: LOG_LEVEL, message: string) {
		const color = Logger.getConsoleColor(level);
		const method = Logger.getConsoleMethod(level);
		method(color, message);
	}

	private static writeToFile(log: string) {
		const dir: string = logsBaseUrl;
		const fs = fileBasedStorage();
		if (!fs) return;
		const date = new Date();
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}
		const fileName = `${dir}/${date.toISOString().slice(0, 10)}.log`;
		fs.appendFileSync(fileName, log);
	}
	private static logMessages = (level: LOG_LEVEL, messages: Array<any>) => {
		const message = Logger.getMessageToLog(level, ...messages);
		Logger.writeToConsole(level, message);
		Logger.writeToFile(message);
	};

	public static info(...messages: Array<any>) {
		Logger.logMessages("info", messages);
	}

	public static warn(...messages: Array<any>) {
		Logger.logMessages("warn", messages);
	}

	public static error(...messages: Array<any>) {
		Logger.logMessages("error", messages);
	}

	public static debug(...messages: Array<any>) {
		if (!enableDebugging) return;
		Logger.logMessages("debug", messages);
	}

	public static verbose(...messages: Array<any>) {
		Logger.logMessages("verbose", messages);
	}

	public static silly(...messages: Array<any>) {
		Logger.logMessages("silly", messages);
	}

	public static http(...messages: Array<any>) {
		Logger.logMessages("http", messages);
	}

	public static log(...messages: Array<any>) {
		Logger.logMessages("log", messages);
	}
}
