import { HTTP } from "@/constants";
import { logsBaseUrl } from "@/constants/variables";
import { LOG_LEVEL } from "@/log";
import { ApiRequest, ApiResponse } from "@/types/api";
import {
	getArray,
	getNonEmptyString,
	getNonNullValue,
	safeParse,
} from "@/utils/safety";
import fs from "fs";

export const getAllLogs = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const files = fs.readdirSync(logsBaseUrl);
		return res.status(HTTP.status.SUCCESS).json({
			message: "Logs fetched successfully",
			data: files.map((f) => f.replace(".log", "")),
		});
	} catch (error: any) {
		return res.status(HTTP.status.INTERNAL_SERVER_ERROR).json({
			message: error.message || HTTP.message.INTERNAL_SERVER_ERROR,
		});
	}
};

export const getLogFile = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const fileName = getNonNullValue(
			safeParse(getNonEmptyString, req.query.id)
		);
		const log = fs.readFileSync(`${logsBaseUrl}/${fileName}.log`, "utf8");
		return res.status(HTTP.status.SUCCESS).json({
			message: "Log fetched successfully",
			data: log,
		});
	} catch (error: any) {
		return res.status(HTTP.status.INTERNAL_SERVER_ERROR).json({
			message: error.message || HTTP.message.INTERNAL_SERVER_ERROR,
		});
	}
};

export const log = (req: ApiRequest, res: ApiResponse) => {
	try {
		const level = getNonNullValue(
			safeParse(getNonEmptyString<LOG_LEVEL>, req.body.level)
		);
		// const message = req.body.message;
		const messages = safeParse(getArray, req.body.messages);
		if (!messages || messages.length === 0) {
			throw new Error("Message is required");
		}
		const message = messages
			.map((m) =>
				typeof m === "string"
					? m
					: typeof m === "object"
						? JSON.stringify(m)
						: m
			)
			.map((m) => m.toString())
			.join(" ");
		const dir = getNonNullValue(safeParse(getNonEmptyString, req.body.dir));
		const date = new Date();
		const log = `[${date.toISOString()}] [${level.toUpperCase()}] ${message}\n`;
		switch (level) {
			case "info":
				console.info("\x1b[32m%s\x1b[37m", log);
				break;
			case "warn":
				console.warn("\x1b[33m%s\x1b[0m", log);
				break;
			case "error":
				console.error("\x1b[31m%s\x1b[0m", log);
				break;
			case "debug":
				console.debug("\x1b[34m%s\x1b[0m", log);
				break;
			case "verbose":
				console.log("\x1b[35m%s\x1b[0m", log);
				break;
			case "silly":
				console.log("\x1b[36m%s\x1b[0m", log);
				break;
			case "http":
				console.log("\x1b[35m%s\x1b[0m", log);
				break;
			default:
				console.log("\x1b[37m%s\x1b[0m", log);
				break;
		}
		// if directory does not exist, create it
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
		const fileName = `${dir}/${date.getFullYear()}-${date.getMonth()}-${date.getDate()}.log`;
		fs.appendFileSync(fileName, log);
		return res
			.status(HTTP.status.SUCCESS)
			.json({ message: "Logged successfully" });
	} catch (error) {
		console.error("Uncaught exception in logger", error);
		return res
			.status(HTTP.status.SUCCESS)
			.json({ message: HTTP.message.INTERNAL_SERVER_ERROR });
	}
};
