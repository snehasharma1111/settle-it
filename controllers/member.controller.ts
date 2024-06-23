import { HTTP } from "@/constants";
import { expenseService, groupService, memberService } from "@/services/api";
import { ApiRequest, ApiResponse } from "@/types/api";
import { getNonEmptyString } from "@/utils/safety";

export const getMembersForExpense = async (
	req: ApiRequest,
	res: ApiResponse
) => {
	try {
		const loggedInUserId = getNonEmptyString(req.user?.id);
		const id = getNonEmptyString(req.query.id);
		const foundExpense = await expenseService.findById(id);
		if (!foundExpense)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		const foundGroup = await groupService.findById(foundExpense.group.id);
		if (!foundGroup)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		const foundMembers = await memberService.find({ expenseId: id });
		if (!foundMembers)
			return res
				.status(HTTP.status.SUCCESS)
				.json({ message: HTTP.message.SUCCESS, data: [] });
		// allow access only if
		// - is the part of the group
		// - the user created the expense,
		// - or paid for the expense,
		// - or is involved in the expense
		if (
			foundGroup.members.map((m) => m.id).includes(loggedInUserId) ||
			foundMembers.map((m) => m.user.id).includes(loggedInUserId) ||
			foundExpense.paidBy.id === loggedInUserId ||
			foundExpense.createdBy.id === loggedInUserId
		) {
			return res.status(HTTP.status.SUCCESS).json({ data: foundMembers });
		}
		return res.status(HTTP.status.FORBIDDEN).json({ message: "Forbidden" });
	} catch (error: any) {
		console.error(error);
		return res.status(HTTP.status.INTERNAL_SERVER_ERROR).json({
			message: HTTP.message.INTERNAL_SERVER_ERROR,
		});
	}
};

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
		return getMembersForExpense(req, res);
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
