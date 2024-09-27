import { memberControllers } from "@/controllers";
import { ApiWrapper } from "@/helpers";

const api = new ApiWrapper(
	{ PATCH: memberControllers.settleMemberInExpense },
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
