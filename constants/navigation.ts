import { IGroup, Navigation } from "@/types";
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

const loggedInSideBarLinks = (groups: Array<IGroup>): Array<Navigation> => [
	{
		title: "My Groups",
		icon: "groups",
		route: routes.HOME,
		options: groups.map((group) => ({
			title: group.name,
			icon: "group",
			route: routes.GROUP(group.id),
		})),
	},
	{
		title: "Your Profile",
		icon: "account_circle",
		route: routes.PROFILE,
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

export const getSideBarLinks = ({
	loggedIn,
	groups,
}: {
	loggedIn: boolean;
	groups?: Array<IGroup>;
}) =>
	loggedIn && groups ? loggedInSideBarLinks(groups) : loggedOutSideBarLinks;
