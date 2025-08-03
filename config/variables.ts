type T_URL = "frontend" | "backend" | "server";
type T_NODE_ENV = "development" | "production" | "test";

export const url: Record<T_URL, string> = {
	frontend:
		process.env.NEXT_PUBLIC_FRONTEND_BASE_URL || "http://localhost:3000",
	backend:
		process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3000",
	server: process.env.NEXT_PUBLIC_SERVER_BASE_URL || "http://localhost:4000",
};

export const enableDebugging: boolean =
	process.env.NEXT_PUBLIC_ENABLE_DEBUGGING === "true" || false;

export const service = process.env.NEXT_PUBLIC_SERVICE || "balance-it";

export const nodeEnv: T_NODE_ENV =
	process.env.NODE_ENV || process.env.NEXT_PUBLIC_NODE_ENV || "production";
