import { http } from "@/connections";
import { logsBaseUrl } from "@/constants/variables";

export type LOG_LEVEL =
	| "log"
	| "info"
	| "warn"
	| "error"
	| "debug"
	| "verbose"
	| "silly"
	| "http";

const log = (level: LOG_LEVEL, dir: string, ...messages: Array<any>) => {
	http.post("/log", { level, messages, dir });
};

class Logger {
	private readonly directory: string;

	constructor(dir: string) {
		this.directory = dir;
	}

	info(...messages: Array<any>) {
		log("info", this.directory, messages);
	}

	warn(...messages: Array<any>) {
		log("warn", this.directory, messages);
	}

	error(...messages: Array<any>) {
		log("error", this.directory, messages);
	}

	debug(...messages: Array<any>) {
		log("debug", this.directory, messages);
	}

	verbose(...messages: Array<any>) {
		log("verbose", this.directory, messages);
	}

	silly(...messages: Array<any>) {
		log("silly", this.directory, messages);
	}

	http(...messages: Array<any>) {
		log("http", this.directory, messages);
	}

	log(...messages: Array<any>) {
		log("log", this.directory, messages);
	}
}

// export default new Logger("logs");

const logger = new Logger(logsBaseUrl);
export default logger;
