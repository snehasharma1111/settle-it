/* eslint-disable no-unused-vars */
import { url } from "@/config";
import logger from "@/log";
import mongoose from "mongoose";

declare global {
	var isConnected: boolean;
	var db: mongoose.Mongoose;
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
		} catch (error) {
			logger.error("Error connecting to MongoDB", error);
		}
	}
}

export const db = new DatabaseManager();
