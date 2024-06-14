import { USER_STATUS, fallbackAssets } from "@/constants";
import { T_USER_STATUS } from "@/types/user";
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
		},
		phone: {
			type: String,
			unique: true,
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
	},
	{
		timestamps: true,
	}
);

export const UserModel =
	mongoose.models.User || mongoose.model("User", UserSchema);

export type User = {
	id: string;
	name?: string;
	email: string;
	phone?: string;
	avatar?: string;
	status: T_USER_STATUS;
	createdAt: string;
	updatedAt: string;
};
