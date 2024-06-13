import { HTTP, OTP_STATUS, USER_STATUS } from "@/constants";
import { authService, otpService, userService } from "@/services/api";
import { ApiRequest, ApiResponse } from "@/types/api";
import { getNonEmptyString, safeParse } from "@/utils/safety";

export const requestOtpWithEmail = async (
	req: ApiRequest,
	res: ApiResponse
) => {
	try {
		const email = getNonEmptyString(req.body.email);
		const foundOtp = await otpService.findOne({ email });
		const otp = otpService.generate();
		if (foundOtp) {
			await otpService.update(
				{ email },
				{
					otp,
					status: OTP_STATUS.PENDING,
				}
			);
			await otpService.send(email, otp);
		} else {
			await otpService.create({
				email,
				otp,
				status: OTP_STATUS.PENDING,
			});
			await otpService.send(email, otp);
		}
		return res.status(200).json({ message: "OTP sent successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: HTTP.message.INTERNAL_SERVER_ERROR,
		});
	}
};

export const verifyOtpWithEmail = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const email = safeParse(getNonEmptyString, req.body.email);
		if (!email)
			return res.status(400).json({ message: "Email is required" });
		const otp = safeParse(getNonEmptyString, req.body.otp);
		if (!otp) return res.status(400).json({ message: "OTP is required" });
		const foundOtp = await otpService.findOne({ email });
		if (!foundOtp)
			return res
				.status(400)
				.json({ message: "No OTP was requested from this email" });
		if (foundOtp.status === OTP_STATUS.VERIFIED)
			return res.status(400).json({ message: "OTP already verified" });
		if (
			new Date().getTime() - new Date(foundOtp.updatedAt).getTime() >
			5 * 60 * 1000
		)
			return res.status(400).json({ message: "OTP Expired" });
		if (foundOtp.otp !== otp)
			return res.status(400).json({ message: "Invalid OTP provided" });
		await otpService.update({ email }, { status: OTP_STATUS.VERIFIED });
		return res.status(200).json({ message: "OTP verified successfully" });
	} catch (error: any) {
		console.error(error);
		if (error.message.toLowerCase().startsWith("invalid input")) {
			return res
				.status(400)
				.json({ message: "Please provide a valid OTP" });
		}
		return res.status(500).json({
			message: HTTP.message.INTERNAL_SERVER_ERROR,
		});
	}
};

export const login = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const email = safeParse(getNonEmptyString, req.body.email);
		if (!email)
			return res.status(400).json({ message: "Email is required" });
		const otp = safeParse(getNonEmptyString, req.body.otp);
		if (!otp) return res.status(400).json({ message: "OTP is required" });
		// search in otp table for email, otp, status = verified
		const foundOtp = await otpService.findOne({
			email,
			otp,
			status: OTP_STATUS.VERIFIED,
		});
		if (!foundOtp) {
			return res
				.status(401)
				.json({ message: "Please verify your email" });
		}
		// update otp status to OTP_STATUS.Expired
		// if time difference between updated_at and current time is greater than 5 minutes, send 410
		await otpService.update({ email }, { status: OTP_STATUS.EXPIRED });
		if (
			new Date().getTime() - new Date(foundOtp.updatedAt).getTime() >
			5 * 60 * 1000
		) {
			return res.status(410).json({ message: "OTP Expired" });
		}
		// search in user table for email
		const foundUser = await userService.findOne({ email });
		if (!foundUser) {
			// create user
			const user = await userService.create({
				email,
				status: USER_STATUS.JOINED,
			});
			const token = authService.generateToken(`${user.id}`);
			res.setHeader(
				"Set-Cookie",
				`token=${token}; HttpOnly; Path=/; Max-Age=${
					30 * 24 * 60 * 60 * 1000
				}; SameSite=None; Secure=true`
			);
			return res.status(201).json({
				message: HTTP.message.SUCCESS,
				data: user,
			});
		} else {
			// return user
			const token = authService.generateToken(`${foundUser.id}`);
			res.setHeader(
				"Set-Cookie",
				`token=${token}; HttpOnly; Path=/; Max-Age=${
					30 * 24 * 60 * 60 * 1000
				}; SameSite=None; Secure=true`
			);
			return res.status(200).json({
				message: HTTP.message.SUCCESS,
				data: foundUser,
			});
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: HTTP.message.INTERNAL_SERVER_ERROR,
		});
	}
};

export const verify = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const token = req.cookies.token;
		if (!token) {
			return res.status(401).json({ message: HTTP.message.BAD_REQUEST });
		}
		const user = await authService.authenticate(token);
		if (!user) {
			return res.status(401).json({ message: HTTP.message.UNAUTHORIZED });
		}
		return res.status(200).json({
			message: HTTP.message.SUCCESS,
			data: user,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: HTTP.message.INTERNAL_SERVER_ERROR,
		});
	}
};

export const logout = async (_: ApiRequest, res: ApiResponse) => {
	try {
		res.setHeader(
			"Set-Cookie",
			"token=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure=true"
		);
		return res.status(200).json({ message: HTTP.message.SUCCESS });
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: HTTP.message.INTERNAL_SERVER_ERROR,
		});
	}
};
