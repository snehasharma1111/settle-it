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
	owed: number;
	paid: number;
	transactions: Array<Omit<IBalance, "transactions">>;
};
