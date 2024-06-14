import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		groupId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Group",
		},
		expenseId: {
			type: mongoose.Schema.Types.ObjectId,
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
	},
	{
		timestamps: true,
	}
);

export const MemberModel =
	mongoose.models.Member || mongoose.model("Member", MemberSchema);

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
