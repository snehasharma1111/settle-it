import { db, ObjectId } from "@/db";

export const ExpenseModel = db.model("Expense", {
	title: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	groupId: {
		type: ObjectId,
		required: true,
		ref: "Group",
	},
	paidBy: {
		type: ObjectId,
		required: true,
		ref: "User",
	},
	createdBy: {
		type: ObjectId,
		required: true,
		ref: "User",
	},
	description: {
		type: String,
	},
	paidOn: {
		type: Date,
	},
});

export type Expense = {
	id: string;
	title: string;
	amount: number;
	groupId: string;
	paidBy: string;
	createdBy: string;
	description?: string;
	paidOn?: string;
	createdAt: string;
	updatedAt: string;
};
