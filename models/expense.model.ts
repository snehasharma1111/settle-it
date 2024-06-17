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
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Group",
		},
		paidBy: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
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
	createdBy: string;
	createdAt: string;
	updatedAt: string;
};
