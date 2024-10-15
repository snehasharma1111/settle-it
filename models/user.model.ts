import { fallbackAssets, USER_STATUS } from "@/constants";
import { db, ObjectId } from "@/db";
import { T_USER_STATUS } from "@/types";

export const UserModel = db.model(
	"User",
	{
		name: {
			type: String,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			index: {
				unique: true,
				sparse: true,
			},
		},
		phone: {
			type: String,
			unique: true,
			sparse: true,
		},
		avatar: {
			type: String,
			default: fallbackAssets.avatar,
		},
		status: {
			type: String,
			enum: Object.values(USER_STATUS),
			default: USER_STATUS.JOINED,
		},
		invitedBy: {
			type: ObjectId,
			ref: "User",
			sparse: true,
		},
	},
	{ createIndexes: true, timestamps: true },
	(schema) => {
		schema.index({ name: "text", email: "text", phone: "text" });
	}
);

export type User = {
	id: string;
	name?: string;
	email: string;
	phone?: string;
	avatar?: string;
	status: T_USER_STATUS;
	invitedBy?: string;
	createdAt: string;
	updatedAt: string;
};
