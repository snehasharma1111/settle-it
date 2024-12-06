import { getSideBarLinks } from "@/constants";
import {
	Action,
	AppNetworkStatus,
	AppTheme,
	Navigation,
	UiSlice,
} from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: UiSlice = {
	vh: 0,
	theme: "light",
	isSidebarExpanded: true,
	networkStatus: "online",
	isLoggedIn: false,
	isSyncing: false,
	sideBarLinks: getSideBarLinks(false),
};

export const uiSlice = createSlice({
	name: "ui",
	initialState,
	reducers: {
		setTheme: (state, action: Action<AppTheme>) => {
			state.theme = action.payload;
			document.body.dataset.theme = action.payload;
		},
		toggleTheme: (state) => {
			if (state.theme === "light") {
				state.theme = "dark";
				document.body.dataset.theme = "dark";
			} else {
				state.theme = "light";
				document.body.dataset.theme = "light";
			}
		},
		setOpenSidebar: (state, action: Action<boolean>) => {
			if (action.payload === true) {
				document.body.style.setProperty(
					"--side-width",
					"var(--side-width-expanded)"
				);
			} else {
				document.body.style.setProperty(
					"--side-width",
					"var(--side-width-collapsed)"
				);
			}
			state.isSidebarExpanded = action.payload;
		},
		toggleSidebar: (state) => {
			if (state.isSidebarExpanded) {
				document.body.style.setProperty(
					"--side-width",
					"var(--side-width-collapsed)"
				);
			} else {
				document.body.style.setProperty(
					"--side-width",
					"var(--side-width-expanded)"
				);
			}
			state.isSidebarExpanded = !state.isSidebarExpanded;
		},
		setNetworkStatus: (state, action: Action<AppNetworkStatus>) => {
			state.networkStatus = action.payload;
		},
		setIsLoggedIn: (state, action: Action<boolean>) => {
			state.isLoggedIn = action.payload;
		},
		setIsSyncing: (state, action: Action<boolean>) => {
			state.isSyncing = action.payload;
		},
		setSideBarLinks: (state, action: Action<Array<Navigation>>) => {
			state.sideBarLinks = action.payload;
		},
	},
});

export const {
	setTheme,
	toggleTheme,
	setOpenSidebar,
	toggleSidebar,
	setNetworkStatus,
	setIsLoggedIn,
	setIsSyncing,
	setSideBarLinks,
} = uiSlice.actions;

export default uiSlice.reducer;

export const uiSelector = (state: { ui: UiSlice }) => state.ui;
