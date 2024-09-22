import { USER_STATUS, fallbackAssets } from "@/constants";
import { T_USER_STATUS } from "@/types";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
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
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			sparse: true,
		},
	},
	{
		timestamps: true,
	}
);

UserSchema.index({ name: "text", email: "text", phone: "text" });

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export { UserModel };

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
