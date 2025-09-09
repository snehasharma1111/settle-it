import { AuthMapping, Expense, Group, Member, User } from "@/schema";
import { UpdateModel } from "./parser";

// User
export type IUser = Omit<User, "createdAt" | "updatedAt">;
export type UpdateUser = Omit<UpdateModel<User>, "email">;
export type IAuthMapping = Omit<AuthMapping, "user"> & { user: IUser | null };

// Group
export type IGroup = Omit<Group, "members" | "createdBy"> & {
	members: Array<IUser>;
	createdBy: IUser;
};
export type CreateGroupData = Omit<
	Group,
	"id" | "createdBy" | "createdAt" | "updatedAt"
>;
export type UpdateGroupData = CreateGroupData;

// Expense
export type IExpense = Omit<Expense, "groupId" | "paidBy" | "createdBy"> & {
	group: IGroup;
	paidBy: IUser;
	createdBy: IUser;
};
export type CreateExpenseData = Omit<
	Expense,
	"id" | "createdBy" | "createdAt" | "updatedAt"
> & {
	members: { userId: string; amount: number }[];
};
export type UpdateExpenseData = CreateExpenseData;

// Members
export type IMember = Omit<Member, "userId" | "groupId" | "expenseId"> & {
	user: IUser;
	group: IGroup;
	expense: IExpense;
};
export type Share = {
	user: string;
	amount: number;
};
export type IShare = {
	user: IUser;
	amount: number;
	percentage: number;
	fraction: string;
	opacity: number;
};

// Extra Aggregated Collections
export type Transaction = {
	from: string;
	to: string;
	owed: number;
	paid: number;
};
export type ITransaction = {
	title: string;
	from: IUser;
	to: IUser;
	owed: number;
	paid: number;
};
export type IBalance = {
	user: IUser;
	gives: number;
	gets: number;
	transactions: Array<Omit<IBalance, "transactions">>;
};
export type IOwedRecord = {
	user: IUser;
	amount: number;
	transactions: Array<Omit<IOwedRecord, "transactions">>;
};
export type IBalancesSummary = {
	owes: Array<IOwedRecord>;
	balances: Array<IBalance>;
};
