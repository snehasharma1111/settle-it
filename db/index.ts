import { DbConnectionError } from "@/errors";
import { Logger } from "@/log";
import { DatabaseManagerConfig, DbContainer } from "@/types";
import mongoose from "mongoose";

var cachedConnection: typeof mongoose | null = null;

export class DatabaseManager {
	private config: DatabaseManagerConfig;

	constructor(config: DatabaseManagerConfig) {
		if (!config.uri) {
			throw new DbConnectionError("uri", "Database URI not provided");
		}
		this.config = config;
	}

	public static createContainer(uri: string): DbContainer {
		const db = new DatabaseManager({ uri });
		return { db };
	}

	public async connect() {
		try {
			if (cachedConnection) {
				Logger.info("MongoDB is already connected");
				return true;
			}
			if (mongoose.connection.readyState === 1) {
				Logger.info("MongoDB is already connected");
				return true;
			}
			Logger.info("Connecting to MongoDB");
			const result = await mongoose.connect(this.config.uri);
			cachedConnection = result;
			Logger.info("MongoDB connected");
			return true;
		} catch (error: any) {
			Logger.error("Error connecting to MongoDB", error.message);
			throw new DbConnectionError("DB Connection Initiator");
		}
	}

	public async disconnect() {
		try {
			if (mongoose.connection.readyState === 0) {
				Logger.info("MongoDB is already disconnected");
				return;
			}
			Logger.info("Disconnecting from MongoDB");
			await mongoose.disconnect();
			cachedConnection = null;
			Logger.info("MongoDB disconnected");
		} catch (error: any) {
			Logger.error("Error disconnecting from MongoDB", error.message);
		}
	}

	public isConnected() {
		return mongoose.connection.readyState === 1;
	}
}
