import { memberControllers } from "@/controllers";
import { ApiWrapper } from "@/helpers";

const api = new ApiWrapper(
	{ GET: memberControllers.getMembersForExpense },
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
