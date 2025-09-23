import { AppNetworkStatus, AppTheme, Navigation } from "./ui";
import { IExpense, IGroup, IUser } from "./client";

export type Action<T> = {
	type: string;
	payload: T;
};

export type ExpenseSlice = Array<IExpense>;
export type GroupSlice = Array<IGroup>;
export type UiSlice = {
	vh: number;
	theme: AppTheme;
	accentColor: string;
	isSidebarExpanded: boolean;
	networkStatus: AppNetworkStatus;
	isLoggedIn: boolean;
	isSyncing: boolean;
	sideBarLinks: Array<Navigation>;
};
export type UserSlice = IUser;
