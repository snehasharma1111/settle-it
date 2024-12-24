import { getSideBarLinks } from "@/constants";
import * as allHelpers from "@/context/helpers";
import {
	expenseSelector,
	expenseSlice,
	groupSelector,
	groupSlice,
	uiSelector,
	uiSlice,
	userSelector,
	userSlice,
} from "@/context/slices";
import { AppTheme, IUser } from "@/types";
import { notify } from "@/utils";
import { useDispatch, useSelector } from "react-redux";

export const useStore = () => {
	const dispatch = useDispatch<any>();

	const expenses = useSelector(expenseSelector);
	const user = useSelector(userSelector);
	const groups = useSelector(groupSelector);
	const ui = useSelector(uiSelector);

	const syncTheme = () => {
		const theme = localStorage.getItem("theme");
		if (theme && ["light", "dark"].includes(theme)) {
			dispatch(uiSlice.actions.setTheme(theme as AppTheme));
		} else {
			const h = window.matchMedia("(prefers-color-scheme: dark)");
			if (h.matches) {
				dispatch(uiSlice.actions.setTheme("dark"));
			} else {
				dispatch(uiSlice.actions.setTheme("light"));
			}
		}
	};

	const syncNetworkStatus = () => {
		const status = navigator.onLine ? "online" : "offline";
		dispatch(uiSlice.actions.setNetworkStatus(status));
		if (status === "offline") {
			notify.error("You are offline");
		}
	};

	const syncUserState = (user: IUser) => {
		dispatch(userSlice.actions.setUser(user));
		dispatch(uiSlice.actions.setIsLoggedIn(true));
		dispatch(uiSlice.actions.setSideBarLinks(getSideBarLinks(true)));
	};

	const syncEverything = async () => {
		try {
			dispatch(uiSlice.actions.setIsSyncing(true));
			await Promise.all([
				dispatch(allHelpers.authHelpers.fetchAuthenticatedUser()),
				dispatch(allHelpers.groupHelpers.getAllGroups()),
				dispatch(allHelpers.expenseHelpers.getAllExpenses()),
			]);
		} catch (error) {
			notify.error(error);
		} finally {
			dispatch(uiSlice.actions.setIsSyncing(false));
		}
	};

	const toggleAppTheme = () => {
		localStorage.setItem("theme", ui.theme === "light" ? "dark" : "light");
		dispatch(uiSlice.actions.toggleTheme());
	};

	const openSidebar = () => {
		dispatch(uiSlice.actions.setOpenSidebar(true));
	};

	const closeSideBar = () => {
		dispatch(uiSlice.actions.setOpenSidebar(false));
	};

	const initStore = async (user?: IUser) => {
		syncTheme();
		syncNetworkStatus();
		if (user) {
			syncUserState(user);
		}
	};

	return {
		// dispatch takes an action object and sends it to the store
		dispatch,
		// user and skills: state values
		user,
		expenses,
		groups,
		...ui,
		// actions
		...expenseSlice.actions,
		...userSlice.actions,
		...groupSlice.actions,
		...uiSlice.actions,
		// helpers
		...allHelpers.authHelpers,
		...allHelpers.expenseHelpers,
		...allHelpers.groupHelpers,
		...allHelpers.userHelpers,
		// utils
		syncEverything,
		syncTheme,
		syncNetworkStatus,
		syncUserState,
		toggleAppTheme,
		openSidebar,
		closeSideBar,
		initStore,
	};
};
