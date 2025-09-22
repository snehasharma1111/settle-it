import {
	apiMethods,
	backendBaseUrl,
	HTTP,
	protectedRoutes,
	redirectToLogin,
	serverBaseUrl,
} from "@/constants";
import { Logger } from "@/log";
import { T_API_METHODS } from "@/types";
import { sleep } from "@/utils";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

class HttpWrapper {
	public http: AxiosInstance;
	private retryConfig: {
		retryCount: number;
		retryDelay: number;
	};
	private defaultRetryConfig = {
		retryCount: 3,
		retryDelay: 2,
	};

	constructor(http: AxiosInstance) {
		this.http = http;
		this.retryConfig = this.defaultRetryConfig;
	}

	public async get<T = any, D = any>(
		url: string,
		config?: AxiosRequestConfig<D>
	): Promise<AxiosResponse<T, D>> {
		return this.makeRequest<T, D>(apiMethods.GET, url, {
			config,
		});
	}

	public async post<T = any, D = any>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig<D>
	): Promise<AxiosResponse<T, D>> {
		return this.makeRequest<T, D>(apiMethods.POST, url, {
			data,
			config,
		});
	}

	public async put<T = any, D = any>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig<D>
	): Promise<AxiosResponse<T, D>> {
		return this.makeRequest<T, D>(apiMethods.PUT, url, {
			data,
			config,
		});
	}

	public async patch<T = any, D = any>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig<D>
	): Promise<AxiosResponse<T, D>> {
		return this.makeRequest<T, D>(apiMethods.PATCH, url, {
			data,
			config,
		});
	}

	public async delete<T = any, D = any>(
		url: string,
		config?: AxiosRequestConfig<D>
	): Promise<AxiosResponse<T, D>> {
		return this.makeRequest<T, D>(apiMethods.DELETE, url, { config });
	}

	private log<T = any>(
		method: T_API_METHODS,
		uri: string,
		response: AxiosResponse<T>,
		startTime: number
	) {
		const executionTime = Date.now() - startTime;
		Logger.info(`${method} ${uri} ${response.status} - ${executionTime}ms`);
	}

	private async makeRequest<T = any, D = any>(
		method: T_API_METHODS,
		url: string,
		{ data, config }: { data?: D; config?: AxiosRequestConfig<D> } = {}
	): Promise<AxiosResponse<T, D>> {
		try {
			const startTime = Date.now();
			let response!: AxiosResponse<T, D>;
			if (method === apiMethods.GET) {
				response = await this.http.get<T, AxiosResponse<T, D>, D>(
					url,
					config
				);
			} else if (method === apiMethods.POST) {
				response = await this.http.post<T, AxiosResponse<T, D>, D>(
					url,
					data,
					config
				);
			} else if (method === apiMethods.PUT) {
				response = await this.http.put<T, AxiosResponse<T, D>, D>(
					url,
					data,
					config
				);
			} else if (method === apiMethods.PATCH) {
				response = await this.http.patch<T, AxiosResponse<T, D>, D>(
					url,
					data,
					config
				);
			} else if (method === apiMethods.DELETE) {
				response = await this.http.delete<T, AxiosResponse<T, D>, D>(
					url,
					config
				);
			}
			if (
				this.retryConfig.retryCount !==
				this.defaultRetryConfig.retryCount
			) {
				this.retryConfig = this.defaultRetryConfig;
			}
			this.log(method, url, response, startTime);
			return response;
		} catch (error: any) {
			const statusCode = +error?.response?.status || 0;
			if (statusCode === HTTP.status.SERVICE_UNAVAILABLE) {
				if (this.retryConfig.retryCount > 0) {
					this.retryConfig.retryCount--;
					await sleep(this.retryConfig.retryDelay);
					Logger.debug(
						`Retrying ${method} ${url}...`,
						`Retries left: ${this.retryConfig.retryCount}`
					);
					return await this.makeRequest(method, url, {
						data,
						config,
					});
				} else {
					throw error;
				}
			} else if (statusCode === HTTP.status.UNAUTHORIZED) {
				if (typeof window !== "undefined") {
					const currentPath = window.location.pathname;
					if (protectedRoutes.includes(currentPath)) {
						Object.assign(window.location, {
							href: redirectToLogin(currentPath),
						});
					}
				}
				return error;
			} else {
				throw error;
			}
		}
	}
}

export const http = new HttpWrapper(
	axios.create({
		baseURL: backendBaseUrl + "/api/v1",
		headers: {
			"Content-Type": "application/json",
		},
		withCredentials: true,
		timeout: 15000,
	})
);

export const server = axios.create({
	baseURL: serverBaseUrl + "/api/v1",
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});
