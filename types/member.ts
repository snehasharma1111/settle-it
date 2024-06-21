import { Member } from "@/models";
import { IExpense } from "./expense";
import { IGroup } from "./group";
import { IUser } from "./user";

export type IMember = Omit<Member, "userId" | "groupId" | "expenseId"> & {
	user: IUser;
	group: IGroup;
	expense: IExpense;
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
