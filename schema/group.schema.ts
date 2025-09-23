import { fallbackAssets } from "@/constants";
import { ObjectId } from "@/types";

export const GroupSchema = {
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
};
