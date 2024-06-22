import { EXPENSE_STATUS, HTTP } from "@/constants";
import { memberControllers } from "@/controllers";
import { Expense, Member } from "@/models";
import { expenseService, groupService, memberService } from "@/services/api";
import { ApiRequest, ApiResponse } from "@/types/api";
import { T_EXPENSE_STATUS } from "@/types/user";
import {
	genericParse,
	getArray,
	getNonEmptyString,
	getNonNegativeNumber,
	safeParse,
} from "@/utils/safety";

export const getAllExpensesForUser = async (
	req: ApiRequest,
	res: ApiResponse
) => {
	try {
		const loggedInUserId = getNonEmptyString(req.user?.id);
		const expenses =
			await expenseService.getExpensesForUser(loggedInUserId);
		return res
			.status(HTTP.status.SUCCESS)
			.json({ message: HTTP.message.SUCCESS, data: expenses });
	} catch (error) {
		return res
			.status(HTTP.status.INTERNAL_SERVER_ERROR)
			.json({ message: HTTP.message.INTERNAL_SERVER_ERROR });
	}
};

export const createNewExpense = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const loggedInUserId = getNonEmptyString(req.user?.id);
		const title = genericParse(getNonEmptyString, req.body.title);
		const amount = genericParse(getNonNegativeNumber, req.body.amount);
		const groupId = genericParse(getNonEmptyString, req.query.id);
		const paidBy = safeParse(getNonEmptyString, req.body.paidBy);
		const members = genericParse(
			getArray<{ userId: string; amount: number }>,
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
		const foundGroup = await groupService.findById(groupId);
		if (!foundGroup)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		const includedMembers = members.filter((member) => member.amount > 0);
		if (
			includedMembers.some(
				(member) =>
					!foundGroup.members.map((m) => m.id).includes(member.userId)
			)
		) {
			// check if all sent members are in the group
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
			};
		const createdExpense = await expenseService.create(newExpenseBody);
		// initially, all members are pending, and they have to pay the expense
		const membersForCurrentExpense: Array<
			Omit<Member, "id" | "createdAt" | "updatedAt">
		> = includedMembers.map((member) => ({
			userId: member.userId,
			groupId,
			expenseId: createdExpense.id,
			amount: member.amount,
			owed: member.userId === paidBy ? 0 : member.amount,
			paid: member.userId === paidBy ? member.amount : 0,
		}));
		await memberService.bulkCreate(membersForCurrentExpense);
		return res.status(HTTP.status.CREATED).json({
			message: "Expense created successfully",
			data: createdExpense,
		});
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

export const updateExpense = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const loggedInUserId = getNonEmptyString(req.user?.id);
		const id = getNonEmptyString(req.query.id);
		const title = safeParse(getNonEmptyString, req.body.title);
		const amount = safeParse(getNonNegativeNumber, req.body.amount);
		const paidBy = safeParse(getNonEmptyString, req.body.paidBy);
		const status = safeParse(
			(s: T_EXPENSE_STATUS) => EXPENSE_STATUS[s],
			req.body.status
		);
		const members = safeParse(
			getArray<{ userId: string; amount: number }>,
			req.body.members
		);
		if (!id || !loggedInUserId)
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: HTTP.message.BAD_REQUEST });
		// if amount is updated, members should be sent as well for validation
		if ((amount !== null || amount !== undefined) && members === null) {
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: HTTP.message.BAD_REQUEST });
		}
		if (amount !== null && members !== null) {
			const totalDistributedAmount = members
				.map((member) => member.amount)
				.reduce((a, b) => a + b, 0);
			// check if amount distributed among members is equal to expense amount
			if (totalDistributedAmount !== amount) {
				return res.status(HTTP.status.BAD_REQUEST).json({
					message: "Total amount distributed doesn't match",
				});
			}
		}
		const foundExpense = await expenseService.findById(id);
		if (!foundExpense)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		// the user can only edit expense if
		// - it is created by the user
		// - or it is paid by the user
		if (
			foundExpense.createdBy.id !== loggedInUserId &&
			foundExpense.paidBy.id !== loggedInUserId
		) {
			return res
				.status(HTTP.status.FORBIDDEN)
				.json({ message: HTTP.message.FORBIDDEN });
		}
		const foundGroup = await groupService.findById(foundExpense.group.id);
		if (!foundGroup) {
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		}
		if (amount !== null && members !== null) {
			// check if all sent members are in the group
			if (
				members.some(
					(member) =>
						!foundGroup.members
							.map((m) => m.id)
							.includes(member.userId)
				)
			) {
				return res
					.status(HTTP.status.BAD_REQUEST)
					.json({ message: "Some members are not in the group" });
			}
			const currentMembersOfExpense = await memberService.find({
				expenseId: id,
			});
			if (currentMembersOfExpense === null) {
				if (members.length > 0) {
					const membersToCreateForCurrentExpense: Array<
						Omit<Member, "id" | "createdAt" | "updatedAt">
					> = members.map((member) => ({
						userId: member.userId,
						groupId: foundExpense.group.id,
						expenseId: id,
						amount: member.amount,
						owed: member.amount,
						paid: 0,
					}));
					await memberService.bulkCreate(
						membersToCreateForCurrentExpense
					);
				}
			} else if (Array.isArray(currentMembersOfExpense)) {
				const membersToUpdateForCurrentExpense: Array<Member> = [];
				const membersToRemoveForCurrentExpense: Array<Member> = [];
				currentMembersOfExpense.forEach((member) => {
					const foundMember = members.find(
						(m) => m.userId === member.user.id
					);
					if (foundMember) {
						membersToUpdateForCurrentExpense.push({
							...member,
							userId: member.user.id,
							groupId: member.group.id,
							expenseId: member.expense.id,
							amount: foundMember.amount,
							owed: foundMember.amount,
							paid: 0,
						});
					} else {
						membersToRemoveForCurrentExpense.push({
							...member,
							userId: member.user.id,
							groupId: member.group.id,
							expenseId: member.expense.id,
						});
					}
				});
				const membersToCreateForCurrentExpense: Array<
					Omit<Member, "id" | "createdAt" | "updatedAt">
				> = members
					.filter(
						(m) =>
							!currentMembersOfExpense
								.map((m) => m.user.id)
								.includes(m.userId)
					)
					.map((member) => ({
						userId: member.userId,
						groupId: foundExpense.group.id,
						expenseId: id,
						amount: member.amount,
						owed:
							member.userId === (paidBy ?? foundExpense.paidBy.id)
								? 0
								: member.amount,
						paid:
							member.userId === (paidBy ?? foundExpense.paidBy.id)
								? member.amount
								: 0,
					}));
				if (membersToCreateForCurrentExpense.length > 0) {
					await memberService.bulkCreate(
						membersToCreateForCurrentExpense
					);
				}
				if (membersToRemoveForCurrentExpense.length > 0) {
					await memberService.bulkRemove({
						_id: {
							$in: membersToRemoveForCurrentExpense.map(
								(m) => m.id
							),
						},
					});
				}
				if (membersToUpdateForCurrentExpense.length > 0) {
					await memberService.bulkUpdate(
						membersToUpdateForCurrentExpense.map((m) => ({
							filter: { _id: m.id },
							update: {
								$set: {
									amount: m.amount,
									owed: m.amount,
									paid: 0,
								},
							},
						}))
					);
				}
			} else {
				if (members.length === 1) {
					if (members[0].userId === currentMembersOfExpense.user.id) {
						await memberService.update(
							{ id: currentMembersOfExpense.id },
							{ amount: amount, owed: amount, paid: 0 }
						);
					} else {
						await memberService.create({
							userId: members[0].userId,
							groupId: foundExpense.group.id,
							expenseId: id,
							amount: members[0].amount,
							owed: members[0].amount,
							paid: 0,
						});
						await memberService.remove({
							id: currentMembersOfExpense.id,
						});
					}
				} else if (members.length > 1) {
					const membersToCreateForCurrentExpense: Array<
						Omit<Member, "id" | "createdAt" | "updatedAt">
					> = members
						.filter(
							(m) => m.userId !== currentMembersOfExpense.user.id
						)
						.map((member) => ({
							userId: member.userId,
							groupId: foundExpense.group.id,
							expenseId: id,
							amount: member.amount,
							owed: member.amount,
							paid: 0,
						}));
					await memberService.bulkCreate(
						membersToCreateForCurrentExpense
					);
				} else if (members.length === 0) {
					return res
						.status(HTTP.status.BAD_REQUEST)
						.json({ message: "No members found" });
				}
			}
		}
		const updatedExpenseBody: Partial<Expense> = {};
		if (title) updatedExpenseBody.title = title;
		if (amount) updatedExpenseBody.amount = amount;
		if (paidBy) {
			// person who paid should be a part of the group
			if (
				!foundGroup.members.map((m) => m.id).find((m) => m === paidBy)
			) {
				return res.status(HTTP.status.BAD_REQUEST).json({
					message: "Person who paid should be a part of the group",
				});
			}
			updatedExpenseBody.paidBy = paidBy;
		}
		if (status) {
			if (status === EXPENSE_STATUS.SETTLED) {
				await memberService.settleMany({ expenseId: id });
			}
		}
		const updatedExpense = await expenseService.update(
			{ id },
			updatedExpenseBody
		);
		return res.status(HTTP.status.SUCCESS).json({
			message: HTTP.message.SUCCESS,
			data: updatedExpense,
		});
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

export const removeExpense = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const loggedInUserId = getNonEmptyString(req.user?.id);
		const id = getNonEmptyString(req.query.id);
		const foundExpense = await expenseService.findById(id);
		if (!foundExpense)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		if (
			foundExpense.createdBy.id !== loggedInUserId &&
			foundExpense.paidBy.id !== loggedInUserId
		)
			return res
				.status(HTTP.status.FORBIDDEN)
				.json({ message: HTTP.message.FORBIDDEN });
		// remove all members for the current expense
		await memberService.bulkRemove({ expenseId: id });
		const removedExpense = await expenseService.remove({ id });
		return res.status(HTTP.status.SUCCESS).json({
			message: HTTP.message.SUCCESS,
			data: removedExpense,
		});
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

export const settleExpense = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const loggedInUserId = getNonEmptyString(req.user?.id);
		const id = getNonEmptyString(req.query.id);
		const foundExpense = await expenseService.findById(id);
		if (!foundExpense)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		if (foundExpense.paidBy.id !== loggedInUserId)
			return res
				.status(HTTP.status.FORBIDDEN)
				.json({ message: "Only the person who paid can settle" });
		await memberService.settleMany({ expenseId: id });
		return memberControllers.getMembersForExpense(req, res);
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

export const memberPaid = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const loggedInUserId = getNonEmptyString(req.user?.id);
		const memberId = genericParse(getNonEmptyString, req.query.memberId);
		const paidAmount = genericParse(
			getNonNegativeNumber,
			req.body.paidAmount
		);
		const foundMember = await memberService.findById(memberId);
		if (!foundMember)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		const foundExpense = await expenseService.findById(
			foundMember.expense.id
		);
		if (!foundExpense)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		if (foundExpense.paidBy.id !== loggedInUserId)
			return res
				.status(HTTP.status.FORBIDDEN)
				.json({ message: "Only the person who paid can settle" });
		if (foundMember.owed === paidAmount) {
			await memberService.settleOne({
				expenseId: foundMember.expense.id,
				id: memberId,
			});
		} else {
			await memberService.update(
				{ id: memberId },
				{
					owed: foundMember.owed - paidAmount,
					paid: foundMember.paid + paidAmount,
				}
			);
		}
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
