import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			default: "/vectors/group.svg",
		},
		banner: {
			type: String,
			default: "/vectors/banner.svg",
		},
		type: {
			type: String,
			default: "Other",
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

export const GroupModel =
	mongoose.models.Group || mongoose.model("Group", GroupSchema);

export type Group = {
	id: string;
	name: string;
	icon: string;
	banner: string;
	type: string;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
};
