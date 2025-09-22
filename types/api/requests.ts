import {
	CreateExpenseData,
	CreateGroupData,
	IUser,
	T_EXPENSE_STATUS,
	UpdateExpenseData,
	UpdateGroupData,
} from "@/types";

// Auth
export type VerifyGoogleOAuth = { code: string };
export type ContinueGoogleOAuth = { token: string };
export type VerifyUser = IUser;
export type RequestOtp = { email: string };
export type VerifyOtp = { email: string; otp: string };
export type Logout = null;

// User
export type UpdateUser = Partial<IUser>;
export type SearchUsers = { query: string };
export type InviteUser = { email: string };
export type BulkUserSearch = { query: string };

// Admin
export type GetLogFileByName = { name: string };

// Group
export type CreateGroup = CreateGroupData;
export type UpdateGroup = UpdateGroupData;
export type DeleteGroup = { id: string };
export type AddMembers = { members: string[] };

// Expense
export type CreateExpense = CreateExpenseData & {
	members: Array<{ userId: string; amount: number }>;
};
export type UpdateExpense = Partial<UpdateExpenseData> & {
	members?: Array<{ userId: string; amount: number }>;
	status?: T_EXPENSE_STATUS;
};
export type SettleExpense = null;
export type RemoveExpense = null;
export type MemberPaidAmount = { paidAmount: number };

// Member
export type SettleMemberInExpense = null;
export type SettleOwedMembersInGroup = {
	userA: string;
	userB: string;
};
