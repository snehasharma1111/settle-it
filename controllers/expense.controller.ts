import { HTTP, EXPENSE_STATUS } from "@/constants";
import { Expense, Member } from "@/models";
import { expenseService, groupService, memberService } from "@/services/api";
import { ApiRequest, ApiResponse } from "@/types/api";
import { intersection } from "@/utils/functions";
import {
	genericParse,
	getArray,
	getNonEmptyString,
	getNonNegativeNumber,
	safeParse,
} from "@/utils/safety";

export const createNewExpense = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const loggedInUserId = getNonEmptyString(req.user?.id);
		const title = genericParse(getNonEmptyString, req.body.title);
		const amount = genericParse(getNonNegativeNumber, req.body.amount);
		const groupId = genericParse(getNonEmptyString, req.body.groupId);
		const paidBy = safeParse(getNonEmptyString, req.body.paidBy);
		const members = genericParse(
			getArray<{ id: string; amount: number }>,
			req.body.members
		);
		if (!title || !groupId || !loggedInUserId)
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: HTTP.message.BAD_REQUEST });
		const totalDistributedAmount = members
			.map((member) => member.amount)
			.reduce((a, b) => a + b, 0);
		// check if amount distributed among members is equal to expense amount
		if (totalDistributedAmount !== amount) {
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: "Total amount distributed doesn't match" });
		}
		// check if it is a valid group
		const foundGroup = await groupService.findOne({ id: groupId });
		if (!foundGroup)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		const includedMembers = members.filter((member) => member.amount > 0);
		// check if all sent members are in the group
		const intersectedMembers = intersection(
			includedMembers.map((member) => member.id),
			foundGroup.members
		);
		if (includedMembers.length !== intersectedMembers.length) {
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: "Some members are not in the group" });
		}
		const newExpenseBody: Omit<Expense, "id" | "createdAt" | "updatedAt"> =
			{
				title,
				amount,
				groupId,
				paidBy: paidBy || loggedInUserId,
				createdBy: loggedInUserId,
				status: EXPENSE_STATUS.PENDING,
			};
		const createdExpense = await expenseService.create(newExpenseBody);
		// initially, all members are pending, and they have to pay the expense
		const membersForCurrentExpense: Array<
			Omit<Member, "id" | "createdAt" | "updatedAt">
		> = includedMembers.map((member) => ({
			userId: member.id,
			groupId,
			expenseId: createdExpense.id,
			amount: member.amount,
			status: EXPENSE_STATUS.PENDING,
			owed: member.amount,
			paid: 0,
		}));
		const createdMembers: Array<Member> = await memberService.bulkCreate(
			membersForCurrentExpense
		);
		return res.status(HTTP.status.CREATED).json({
			message: "Expense created successfully",
			data: createdMembers,
		});
	} catch (error) {
		console.error(error);
		return res.status(HTTP.status.INTERNAL_SERVER_ERROR).json({
			message: HTTP.message.INTERNAL_SERVER_ERROR,
		});
	}
};
