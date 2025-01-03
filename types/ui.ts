export type AppTheme = "light" | "dark";
export type AppNetworkStatus = "online" | "offline";

export type Navigation = {
	title: string;
	icon: string;
	route: string;
	options?: Array<Omit<Navigation, "options">>;
};
