import { Navigation } from "@/types";
import { routes } from "./routes";

const loggedOutSideBarLinks: Array<Navigation> = [
	{
		title: "Home",
		icon: "home",
		route: routes.ROOT,
	},
	{
		title: "About",
		icon: "info",
		route: routes.ABOUT,
	},
	{
		title: "Help",
		icon: "help",
		route: routes.HELP,
	},
	{
		title: "Privacy Policy",
		icon: "receipt",
		route: routes.PRIVACY_POLICY,
	},
	{
		title: "Report A Bug",
		icon: "report",
		route: routes.REPORT,
	},
	{
		title: "Contact Us",
		icon: "call",
		route: routes.CONTACT,
	},
];

const loggedInSideBarLinks: Array<Navigation> = [
	{
		title: "My Groups",
		icon: "group",
		route: routes.HOME,
	},
	{
		title: "About",
		icon: "info",
		route: routes.ABOUT,
	},
	{
		title: "Help",
		icon: "help",
		route: routes.HELP,
	},
	{
		title: "Privacy Policy",
		icon: "receipt",
		route: routes.PRIVACY_POLICY,
	},
	{
		title: "Report A Bug",
		icon: "report",
		route: routes.REPORT,
	},
	{
		title: "Contact Us",
		icon: "call",
		route: routes.CONTACT,
	},
];

export const getSideBarLinks = (loggedIn: boolean) =>
	loggedIn ? loggedInSideBarLinks : loggedOutSideBarLinks;
