import { apiMethods, HTTP } from "@/constants";
import { db } from "@/db";
import { logger } from "@/log";
import { adminMiddleware, authMiddleware } from "@/middlewares";
import { profiler } from "@/services";
import {
	ApiController,
	ApiControllers,
	ApiRequest,
	ApiResponse,
	ApiWrapperOptions,
	T_API_METHODS,
} from "@/types";
import { NextApiHandler } from "next";

export class ApiWrapper {
	// Options for API Wrapper
	useDatabase = false;
	isAdmin = false;
	isAuthenticated = false;

	// API Controllers
	GET: ApiController | undefined;
	POST: ApiController | undefined;
	PUT: ApiController | undefined;
	PATCH: ApiController | undefined;
	DELETE: ApiController | undefined;

	// Allowed Methods
	allowedMethods: Array<T_API_METHODS> = [
		apiMethods.GET,
		apiMethods.POST,
		apiMethods.PUT,
		apiMethods.PATCH,
		apiMethods.DELETE,
	];

	/**
	 * Initializes a new instance of the ApiWrapper class.
	 *
	 * @param {ApiControllers} controllers - An object containing API controllers for different HTTP methods.
	 * @param {ApiWrapperOptions} [options={}] - Options for the API wrapper.
	 * @param {boolean} options.db - Whether to use the database.
	 * @param {boolean} options.auth - Whether to require authentication.
	 * @param {boolean} options.admin - Whether to require admin privileges.
	 */
	constructor(
		{ GET, POST, PUT, PATCH, DELETE }: ApiControllers,
		{ db, auth, admin }: ApiWrapperOptions = {}
	) {
		if (db === true) {
			this.useDatabase = true;
		}

		if (auth === true) {
			this.useDatabase = true;
			this.isAuthenticated = true;
		}

		if (admin === true) {
			this.useDatabase = true;
			this.isAdmin = true;
		}

		if (GET) {
			this.GET = GET;
			this.allowedMethods.push(apiMethods.GET);
		}

		if (POST) {
			this.POST = POST;
			this.allowedMethods.push(apiMethods.POST);
		}

		if (PUT) {
			this.PUT = PUT;
			this.allowedMethods.push(apiMethods.PUT);
		}

		if (PATCH) {
			this.PATCH = PATCH;
			this.allowedMethods.push(apiMethods.PATCH);
		}

		if (DELETE) {
			this.DELETE = DELETE;
			this.allowedMethods.push(apiMethods.DELETE);
		}
	}

	/**
	 * Wraps the provided controller with the appropriate middleware based on the authentication status.
	 *
	 * @param {ApiController} controller - The controller to be wrapped with middleware.
	 * @return {ApiController} The wrapped controller with the applied middleware.
	 */
	private wrapper(controller: ApiController) {
		if (this.isAdmin) {
			return adminMiddleware.apiRoute(controller);
		} else if (this.isAuthenticated) {
			return authMiddleware.apiRoute(controller);
		} else {
			return controller;
		}
	}

	/**
	 * Returns a Next.js API handler function that wraps the provided API controllers with middleware
	 * based on the authentication status and handles database connections.
	 *
	 * @return {NextApiHandler} A Next.js API handler function.
	 */
	public getHandler() {
		const handler: NextApiHandler = async (
			req: ApiRequest,
			res: ApiResponse
		) => {
			try {
				if (this.useDatabase) {
					await db.connect();
				}

				const { method } = req;
				if (method === apiMethods.GET && this.GET) {
					return profiler(
						this.wrapper(this.GET),
						[this.GET.name],
						req,
						res
					);
				} else if (method === apiMethods.POST && this.POST) {
					return profiler(
						this.wrapper(this.POST),
						[this.POST.name],
						req,
						res
					);
				} else if (method === apiMethods.PUT && this.PUT) {
					return profiler(
						this.wrapper(this.PUT),
						[this.PUT.name],
						req,
						res
					);
				} else if (method === apiMethods.PATCH && this.PATCH) {
					return profiler(
						this.wrapper(this.PATCH),
						[this.PATCH.name],
						req,
						res
					);
				} else if (method === apiMethods.DELETE && this.DELETE) {
					return profiler(
						this.wrapper(this.DELETE),
						[this.DELETE.name],
						req,
						res
					);
				} else {
					res.setHeader("Allow", this.allowedMethods);
					return res
						.status(HTTP.status.METHOD_NOT_ALLOWED)
						.send(`Method ${method} Not Allowed`);
				}
			} catch (error: any) {
				logger.error(error);
				return res.status(HTTP.status.INTERNAL_SERVER_ERROR).json({
					message:
						error.message || HTTP.message.INTERNAL_SERVER_ERROR,
				});
			}
		};

		return handler;
	}
}
