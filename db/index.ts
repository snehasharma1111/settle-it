/* eslint-disable no-unused-vars */
import { url } from "@/config";
import { logger } from "@/log";
import { UserModel } from "@/models";
import mongoose from "mongoose";

declare global {
	var mongoose: {
		conn: typeof import("mongoose") | null;
		promise: Promise<typeof import("mongoose")> | null;
	};
}

global.mongoose = global.mongoose || {
	conn: null,
	promise: null,
};

export class DatabaseManager {
	private static isIntervalSet = false;
	constructor() {
		this.connect();
		if (!DatabaseManager.isIntervalSet) {
			DatabaseManager.isIntervalSet = true;
			setInterval(() => this.ping(), 10000);
		}
	}

	public async connect() {
		if (global.mongoose.conn && global.mongoose.conn.connection.db) {
			logger.info("MongoDB is already connected");
			return global.mongoose.conn;
		}

		if (!global.mongoose.promise || !global.mongoose.conn) {
			mongoose.set("strictQuery", true);
			mongoose.set("debug", true);
			global.mongoose.promise = mongoose
				.connect(url.db)
				.then((mongooseInstance) => {
					logger.info("MongoDB connected");
					return mongooseInstance;
				})
				.catch((error) => {
					logger.error("Error connecting to MongoDB", error);
					throw error;
				});
			try {
				logger.info("Connecting to MongoDB");
				global.mongoose.conn = await global.mongoose.promise;
				await this.ensureIndexes();
				return global.mongoose.conn;
			} catch (error) {
				logger.error("Error connecting to MongoDB", error);
				global.mongoose.conn = null;
				global.mongoose.promise = null;
				throw error;
			}
		}
	}

	public async disconnect() {
		if (!global.mongoose.conn) {
			logger.info("MongoDB is already disconnected");
			return;
		}
		logger.info("Disconnecting from MongoDB");
		await mongoose.disconnect();
		global.mongoose.conn = null;
		global.mongoose.promise = null;
		logger.info("MongoDB disconnected");
	}

	private async ensureIndexes() {
		await UserModel.createIndexes();
		logger.info("MongoDB indexes created");
	}

	private async ping() {
		if (!global.mongoose.conn || !global.mongoose.conn.connection.db) {
			logger.info("MongoDB is not connected");
			return false;
		}
		try {
			await global.mongoose.conn.connection.db.command({ ping: 1 });
			logger.info("MongoDB is connected");
			return true;
		} catch (error) {
			logger.info("MongoDB ping failed");
			return false;
		}
	}

	public isReady() {
		this.connect();
		if (global.mongoose.conn) {
			return true;
		} else {
			return false;
		}
	}
}

export const db = new DatabaseManager();
