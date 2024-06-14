import { fallbackAssets } from "@/constants";
import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			default: fallbackAssets.groupIcon,
		},
		banner: {
			type: String,
			default: fallbackAssets.banner,
		},
		type: {
			type: String,
			default: "Other",
		},
		members: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
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
	icon?: string;
	banner?: string;
	type?: string;
	members: string[];
	createdBy: string;
	createdAt: string;
	updatedAt: string;
};
