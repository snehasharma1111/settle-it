import { service, url } from "@/config";

export const frontendBaseUrl: string = url.frontend;
export const backendBaseUrl: string = url.backend;
export const serverBaseUrl: string = url.server;
export const logsBaseUrl: string = "logs";
export const serviceName = service;

export const fallbackAssets = Object.freeze({
	avatar: `${frontendBaseUrl}/vectors/user.svg`,
	groupIcon: `${frontendBaseUrl}/images/group-icon.png`,
	banner: `${frontendBaseUrl}/images/banner.png`,
});
