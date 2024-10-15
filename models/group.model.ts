import { fallbackAssets } from "@/constants";
import { db, ObjectId } from "@/db";

export const GroupModel = db.model("Group", {
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
			type: ObjectId,
			ref: "User",
		},
	],
	createdBy: {
		type: ObjectId,
		required: true,
		ref: "User",
	},
});

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
