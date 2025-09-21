import { BaseRepo } from "./base";
import { Otp } from "@/schema";
import { OtpModel } from "@/models";

class OtpRepo extends BaseRepo<Otp> {
	protected model = OtpModel;
}

export const otpRepo = OtpRepo.getInstance<OtpRepo>();
