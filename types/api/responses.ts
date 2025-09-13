import {
	CreateGroupData,
	IBalancesSummary,
	IExpense,
	IGroup,
	IShare,
	ITransaction,
	IUser,
} from "@/types";

// Auth
export type VerifyUser = IUser;
export type VerifyGoogleOAuth = string;
export type ContinueGoogleOAuth = IUser;
export type RequestOtp = null;
export type VerifyOtp = IUser;
export type Logout = null;

// User
export type UpdateUser = IUser;
export type SearchUsers = Array<IUser>;
export type InviteUser = IUser;
export type BulkUserSearch = {
	users: Array<IUser>;
	message: string;
};

// Group
export type GetGroupsForUser = Array<IGroup>;
export type GetGroupDetails = IGroup;
export type GetGroupExpenses = Array<IExpense>;
export type CreateGroup = IGroup;
export type UpdateGroupDetails = IGroup;
export type DeleteGroup = IGroup;
export type AddMembers = IGroup;

// Wallet
export type GetBalancesSummary = {
	expenditure: number;
	balances: IBalancesSummary;
	shares: Array<IShare>;
};
export type GetTransactions = {
	expenditure: number;
	transactions: Array<ITransaction>;
};
