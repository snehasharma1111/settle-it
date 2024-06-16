import { Expense } from "@/models";
import { IUser } from "./user";

export type IExpense = Omit<Expense, "paidBy" | "createdBy"> & {
	paidBy: IUser;
	createdBy: IUser;
};
