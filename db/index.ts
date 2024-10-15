/* eslint-disable no-unused-vars */
import { url } from "@/config";
import { logger } from "@/log";
import mongoose, { SchemaDefinition } from "mongoose";

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

class DatabaseManager {
	private static isIntervalSet = false;
	constructor() {
		this.connect();
		if (!DatabaseManager.isIntervalSet) {
			DatabaseManager.isIntervalSet = true;
			setInterval(() => this.ping(), 10000);
		}
	}

	private ping() {
		if (!global.mongoose.conn || !global.mongoose.conn.connection.db) {
			logger.info("MongoDB is not connected");
			this.connect();
			return false;
		}
		try {
			global.mongoose.conn.connection.db.command({ ping: 1 });
			logger.info("MongoDB is connected");
			return true;
		} catch (error) {
			logger.info("MongoDB ping failed");
			return false;
		}
	}

	public async connect() {
		if (global.mongoose.conn && global.mongoose.conn.connection.db) {
			logger.info("MongoDB is already connected");
			return global.mongoose.conn;
		}

		if (!global.mongoose.promise || !global.mongoose.conn) {
			mongoose.set("strictQuery", true);
			global.mongoose.promise = mongoose
				.connect(url.db, { heartbeatFrequencyMS: 10000 })
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

	public model(
		name: string,
		schemaDefinition: SchemaDefinition,
		{
			createIndexes,
			timestamps = true,
		}: { createIndexes?: boolean; timestamps?: boolean } = {
			timestamps: true,
		},
		callback?: (schema: mongoose.Schema) => void
	): typeof mongoose.Model {
		// const conn = global.mongoose.conn;
		const conn = mongoose;
		if (!conn) {
			this.connect();
			throw new Error("MongoDB is not connected");
		}
		const definedSchema = new conn.Schema(schemaDefinition, { timestamps });
		if (callback) {
			callback(definedSchema);
		}
		const definedModel =
			conn.models[name] || conn.model(name, definedSchema);

		if (createIndexes) {
			definedModel.createIndexes();
		}
		return definedModel;
	}

	public isReady() {
		return this.ping();
	}
}

export const db = new DatabaseManager();
export const ObjectId = mongoose.Schema.Types.ObjectId;
