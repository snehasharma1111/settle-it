import { EXPENSE_STATUS } from "@/constants/enum";
import { T_EXPENSE_STATUS } from "@/types/user";
import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		groupId: {
			type: String,
			required: true,
		},
		paidBy: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		status: {
			type: String,
			enum: Object.values(EXPENSE_STATUS),
			default: EXPENSE_STATUS.PENDING,
		},
	},
	{
		timestamps: true,
	}
);

export const ExpenseModel =
	mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);

export type Expense = {
	id: string;
	title: string;
	amount: number;
	groupId: string;
	paidBy: string;
	status: T_EXPENSE_STATUS;
	createdAt: string;
	updatedAt: string;
};
