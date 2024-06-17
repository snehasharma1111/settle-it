import { Member } from "@/models";
import { IUser } from "./user";
import { IGroup } from "./group";
import { IExpense } from "./expense";

export type IMember = Omit<Member, "userId" | "groupId" | "expenseId"> & {
	user: IUser;
	group: IGroup;
	expense: IExpense;
};
