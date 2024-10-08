import { ApiRoute } from "@/server";
import { authControllers } from "@/controllers";
import { validation } from "@/server";

const api = new ApiRoute(
	{ POST: validation.email(authControllers.verifyOtpWithEmail) },
	{ db: true }
);

export default api.getHandler();

export const config = { maxDuration: 60 };
