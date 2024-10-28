type T_URL = "db" | "frontend" | "backend" | "apiFunction";

export const url: Record<T_URL, string> = {
	db: process.env.DB_URI || "mongodb://localhost:27017/nextjs",
	frontend:
		process.env.NEXT_PUBLIC_FRONTEND_BASE_URL || "http://localhost:3000",
	backend:
		process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
		"http://localhost:4000/api/v1",
	apiFunction:
		process.env.NEXT_PUBLIC_API_FUNCTION_BASE_URL ||
		"http://localhost:3000/api/v1",
};

export const jwtSecret: string =
	process.env.NEXT_PUBLIC_APP_JWT_SECRET || "secret";
