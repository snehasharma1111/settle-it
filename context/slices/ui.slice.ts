import { Action, AppNetworkStatus, AppTheme, UiSlice } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: UiSlice = {
	vh: 0,
	theme: "light",
	openSidebar: false,
	networkStatus: "online",
	isLoggedIn: false,
	isSyncing: false,
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
			state.openSidebar = action.payload;
		},
		toggleSidebar: (state) => {
			state.openSidebar = !state.openSidebar;
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
	},
});

export const {
	setTheme,
	toggleTheme,
	setOpenSidebar,
	toggleSidebar,
	setNetworkStatus,
	setIsLoggedIn,
} = uiSlice.actions;

export default uiSlice.reducer;

export const uiSelector = (state: { ui: UiSlice }) => state.ui;
