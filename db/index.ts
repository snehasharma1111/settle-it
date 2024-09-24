/* eslint-disable no-unused-vars */
import { url } from "@/config";
import { logger } from "@/log";
import { UserModel } from "@/models";
import mongoose from "mongoose";

declare global {
	var isConnected: boolean;
	var db: mongoose.Mongoose | null;
	var client: any;
}

export class DatabaseManager {
	constructor() {
		this.connect();
	}

	public async connect() {
		if (global.isConnected) {
			logger.info("MongoDB is already connected");
			return;
		}

		try {
			logger.info("Connecting to MongoDB");
			const db = await mongoose.connect(url.db);
			logger.info("MongoDB connected");
			global.isConnected = db.connections[0].readyState === 1;
			global.db = db;
			await this.ensureIndexes();
		} catch (error) {
			logger.error("Error connecting to MongoDB", error);
			throw error;
		}
	}

	public async disconnect() {
		if (!global.isConnected) {
			logger.info("MongoDB is already disconnected");
			return;
		}
		logger.info("Disconnecting from MongoDB");
		global.db = null;
		await mongoose.disconnect();
		global.isConnected = false;
		logger.info("MongoDB disconnected");
	}

	async ensureIndexes() {
		await UserModel.createIndexes();
		logger.info("MongoDB indexes created");
	}
}

export const db = new DatabaseManager();
