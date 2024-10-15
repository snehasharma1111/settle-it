import { db, ObjectId } from "@/db";

export const MemberModel = db.model("Member", {
	userId: {
		type: ObjectId,
		required: true,
		ref: "User",
	},
	groupId: {
		type: ObjectId,
		required: true,
		ref: "Group",
	},
	expenseId: {
		type: ObjectId,
		required: true,
		ref: "Expense",
	},
	amount: {
		type: Number,
		required: true,
	},
	owed: {
		type: Number,
		required: true,
	},
	paid: {
		type: Number,
		required: true,
	},
});

export type Member = {
	id: string;
	userId: string;
	groupId: string;
	expenseId: string;
	amount: number;
	owed: number;
	paid: number;
	createdAt: string;
	updatedAt: string;
};
