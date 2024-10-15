import { OTP_STATUS } from "@/constants";
import { db } from "@/db";
import { T_OTP_STATUS } from "@/types";

export const OtpModel = db.model("Otp", {
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
});

export type Otp = {
	id: string;
	email: string;
	otp: string;
	status: T_OTP_STATUS;
	createdAt: string;
	updatedAt: string;
};
