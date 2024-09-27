import { authControllers } from "@/controllers";
import { ApiWrapper } from "@/helpers";

const api = new ApiWrapper(
	{ POST: authControllers.verifyOtpWithEmail },
	{ db: true }
);

export default api.getHandler();

export const config = { maxDuration: 60 };
