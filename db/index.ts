/* eslint-disable no-unused-vars */
import { url } from "@/config";
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
			console.info("MongoDB is already connected");
			return;
		}

		try {
			const db = await mongoose.connect(url.db);
			console.info("MongoDB connected");
			global.isConnected = db.connections[0].readyState === 1;
			global.db = db;
		} catch (error) {
			console.error("Error connecting to MongoDB", error);
		}
	}
}

// export const db = new DatabaseManager();
if (!global.client) global.client = new DatabaseManager();

export const db = global.client;
