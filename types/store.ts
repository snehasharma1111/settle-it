import { IExpense } from "./expense";
import { IGroup } from "./group";
import { AppNetworkStatus, AppTheme, Navigation } from "./ui";
import { IUser } from "./user";

export type Action<T> = {
	type: string;
	payload: T;
};

export type ExpenseSlice = Array<IExpense>;
export type GroupSlice = Array<IGroup>;
export type UiSlice = {
	vh: number;
	theme: AppTheme;
	isSidebarExpanded: boolean;
	networkStatus: AppNetworkStatus;
	isLoggedIn: boolean;
	isSyncing: boolean;
	sideBarLinks: Array<Navigation>;
};
export type UserSlice = IUser;
