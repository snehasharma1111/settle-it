import { HTTP } from "@/constants";
import { Logger } from "@/log";
import { ApiRes, ApiResponse, Cookie } from "@/types";

abstract class ApiBaseResponse<T> {
	protected res: ApiResponse;
	protected payload: ApiRes<T> & { status: number };
	constructor(r: ApiResponse) {
		this.res = r;
		this.payload = {
			status: HTTP.status.SUCCESS,
			message: HTTP.message.SUCCESS,
			data: null as T,
		};
	}
	public status(status: number): this {
		this.payload.status = status;
		this.res.status(status);
		return this;
	}
	public headers(key: string, value: any): this {
		this.res.setHeader(key, value);
		return this;
	}
	public message(message: string): this {
		const payload = {
			...this.payload,
			message,
		};
		this.payload = payload;
		return this;
	}
	public cookies(cookies: Array<Cookie>): this {
		if (!cookies || cookies.length === 0) return this;
		this.res.setHeader(
			"Set-Cookie",
			cookies.map(
				(cookie) =>
					`${cookie.name}=${cookie.value}; HttpOnly; Max-Age=${cookie.maxAge}; Path=/; SameSite=None; Secure=true;`
			)
		);
		return this;
	}
	public json(data: any): this {
		this.res.json(data);
		return this;
	}
	public end(): this {
		this.res.end();
		return this;
	}
}

export class ApiSuccess<T> extends ApiBaseResponse<T> {
	constructor(r: ApiResponse) {
		super(r);
	}
	public data(data: T): ApiSuccess<T> {
		const payload = {
			...this.payload,
			data,
		};
		this.payload = payload;
		return this;
	}
	public send(
		data?: T,
		message: string = this.payload.message,
		status: number = this.payload.status
	): void {
		const payload = {
			...this.payload,
			message,
		};
		if (data) {
			payload.data = data;
		}
		if (this.res.headersSent || this.res.writableEnded) {
			return Logger.error(
				"Response already sent, cannot send response",
				payload
			);
		}
		this.status(status).json(payload).end();
	}
}

export class ApiFailure extends ApiBaseResponse<null> {
	constructor(r: ApiResponse) {
		super(r);
		this.payload.status = HTTP.status.INTERNAL_SERVER_ERROR;
		this.payload.message = HTTP.message.ERROR;
	}
	public send(
		message: string = this.payload.message,
		status: number = this.payload.status
	): void {
		if (this.res.headersSent || this.res.writableEnded) {
			return Logger.error("Response already sent, cannot send response", {
				status,
				message,
			});
		}
		this.status(status).message(message).end();
	}
}
