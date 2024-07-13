import { HTTP } from "@/constants";
import logger from "@/log";
import {
	expenseService,
	groupService,
	memberService,
	userService,
} from "@/services/api";
import { ApiRequest, ApiResponse } from "@/types/api";
import { genericParse, getNonEmptyString } from "@/utils/safety";

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
		logger.error(error);
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
		logger.error(error);
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

export const settleOwedMembersInGroup = async (
	req: ApiRequest,
	res: ApiResponse
) => {
	try {
		const loggedInUserId = getNonEmptyString(req.user?.id);
		const userA = genericParse(getNonEmptyString, req.body.userA);
		const userB = genericParse(getNonEmptyString, req.body.userB);
		const groupId = getNonEmptyString(req.query.id);
		if (loggedInUserId !== userA && loggedInUserId !== userB)
			return res
				.status(HTTP.status.FORBIDDEN)
				.json({ message: HTTP.message.FORBIDDEN });
		const foundGroup = await groupService.findById(groupId);
		if (!foundGroup)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		await memberService.settleAllBetweenUsers(foundGroup.id, userA, userB);
		const allTransactionsForGroup =
			await groupService.getAllTransactionsForGroup(groupId);
		// get all users in this group
		const membersIds = Array.from(
			new Set(
				allTransactionsForGroup
					.map((t) => t.from)
					.concat(allTransactionsForGroup.map((t) => t.to))
			)
		);
		const usersMap = await userService.getUsersMapForUserIds(membersIds);
		const owed = groupService.getOwedBalances(
			allTransactionsForGroup,
			usersMap
		);
		return res
			.status(HTTP.status.SUCCESS)
			.json({ data: owed, message: HTTP.message.SUCCESS });
	} catch (error: any) {
		logger.error(error);
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
