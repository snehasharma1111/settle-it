import { url } from "@/config";

export const frontendBaseUrl: string = url.frontend;
export const backendBaseUrl: string = url.backend;

export const fallbackAssets = Object.freeze({
	avatar: "/vectors/user.svg",
	groupIcon: "/images/group-icon.png",
	banner: "/images/banner.png",
});
