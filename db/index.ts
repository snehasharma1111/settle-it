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
	constructor() {
		this.connect();
	}

	public async connect() {
		if (global.mongoose.conn) {
			logger.info("MongoDB is already connected");
			return;
		}

		if (!global.mongoose.promise) {
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

	async ensureIndexes() {
		await UserModel.createIndexes();
		logger.info("MongoDB indexes created");
	}
}

export const db = new DatabaseManager();
