import { BaseRepo } from "./base";
import { Otp } from "@/types";
import { OtpModel } from "@/models";

class OtpRepo extends BaseRepo<Otp> {
	protected model = OtpModel;
}

export const otpRepo = OtpRepo.getInstance<OtpRepo>();
