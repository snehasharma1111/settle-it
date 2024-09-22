import { OTP_STATUS } from "@/constants";
import { T_OTP_STATUS } from "@/types";
import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			unique: true,
			required: true,
		},
		otp: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: Object.values(OTP_STATUS),
			default: OTP_STATUS.PENDING,
		},
	},
	{
		timestamps: true,
	}
);

export const OtpModel = mongoose.models.Otp || mongoose.model("Otp", OtpSchema);

export type Otp = {
	id: string;
	email: string;
	otp: string;
	status: T_OTP_STATUS;
	createdAt: string;
	updatedAt: string;
};
