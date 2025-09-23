import { ObjectId } from "@/types";

export const AuthMappingSchema = {
	identifier: {
		type: String,
		required: true,
	},
	providerName: {
		type: String,
		required: true,
	},
	providerId: {
		type: String,
		required: true,
	},
	misc: {
		type: String,
		default: "{}",
	},
	user: {
		type: ObjectId,
		ref: "User",
		required: false,
		default: null,
	},
};
