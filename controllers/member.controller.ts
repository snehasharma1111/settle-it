import { HTTP } from "@/constants";
import { expenseService, memberService } from "@/services/api";
import { ApiRequest, ApiResponse } from "@/types/api";
import { getNonEmptyString } from "@/utils/safety";
import { expenseControllers } from ".";

export const settleMemberInExpense = async (
	req: ApiRequest,
	res: ApiResponse
) => {
	try {
		const loggedInUserId = getNonEmptyString(req.user?.id);
		const id = getNonEmptyString(req.query.id);
		const memberId = getNonEmptyString(req.query.memberId);
		const foundExpense = await expenseService.findById(id);
		if (!foundExpense)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		if (foundExpense.paidBy.id !== loggedInUserId)
			return res
				.status(HTTP.status.FORBIDDEN)
				.json({ message: HTTP.message.FORBIDDEN });
		const settledMember = await memberService.settleOne({
			expenseId: id,
			id: memberId,
		});
		if (!settledMember)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		return expenseControllers.getMembersForExpense(req, res);
	} catch (error: any) {
		console.error(error);
		if (error.message && error.message.startsWith("Invalid input:")) {
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: HTTP.message.BAD_REQUEST });
		} else {
			return res.status(HTTP.status.INTERNAL_SERVER_ERROR).json({
				message: HTTP.message.INTERNAL_SERVER_ERROR,
			});
		}
	}
};
