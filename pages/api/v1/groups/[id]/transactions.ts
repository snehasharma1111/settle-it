import { groupControlllers } from "@/controllers";
import { ApiWrapper } from "@/helpers";

const api = new ApiWrapper(
	{ GET: groupControlllers.getGroupTransactions },
	{ db: true, auth: true }
);

const handler = api.getHandler();

export default handler;
