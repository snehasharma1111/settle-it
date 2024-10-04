import { authControllers } from "@/controllers";
import { ApiRouteHandler } from "@/helpers";

const api = new ApiRouteHandler(
	{ POST: authControllers.verifyOtpWithEmail },
	{ db: true }
);

export default api.getHandler();

export const config = { maxDuration: 60 };
