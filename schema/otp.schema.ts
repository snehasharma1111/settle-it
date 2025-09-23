import { OTP_STATUS } from "@/constants";

export const OtpSchema = {
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
};
