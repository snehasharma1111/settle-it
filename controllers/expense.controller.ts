import { EXPENSE_STATUS, HTTP } from "@/constants";
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

export const createNewExpense = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const loggedInUserId = getNonEmptyString(req.user?.id);
		const title = genericParse(getNonEmptyString, req.body.title);
		const amount = genericParse(getNonNegativeNumber, req.body.amount);
		const groupId = genericParse(getNonEmptyString, req.body.groupId);
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
		const foundGroup = await groupService.findOne({ id: groupId });
		if (!foundGroup)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		const includedMembers = members.filter((member) => member.amount > 0);
		if (
			includedMembers.some(
				(member) => !foundGroup.members.includes(member.userId)
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
		if (foundExpense.createdBy !== loggedInUserId)
			return res
				.status(HTTP.status.FORBIDDEN)
				.json({ message: HTTP.message.FORBIDDEN });
		const foundGroup = await groupService.findOne({
			id: foundExpense.groupId,
		});
		if (!foundGroup) return res.status(HTTP.status.NOT_FOUND);
		if (amount !== null && members !== null) {
			// check if all sent members are in the group
			if (
				members.some(
					(member) => !foundGroup.members.includes(member.userId)
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
						groupId: foundExpense.groupId,
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
						(m) => m.userId === member.userId
					);
					if (foundMember) {
						membersToUpdateForCurrentExpense.push({
							...member,
							amount: foundMember.amount,
							owed: foundMember.amount,
							paid: 0,
						});
					} else {
						membersToRemoveForCurrentExpense.push(member);
					}
				});
				const membersToCreateForCurrentExpense: Array<
					Omit<Member, "id" | "createdAt" | "updatedAt">
				> = members
					.filter(
						(m) =>
							!currentMembersOfExpense
								.map((m) => m.userId)
								.includes(m.userId)
					)
					.map((member) => ({
						userId: member.userId,
						groupId: foundExpense.groupId,
						expenseId: id,
						amount: member.amount,
						owed: member.amount,
						paid: 0,
					}));
				if (membersToCreateForCurrentExpense.length > 0) {
					memberService.bulkCreate(membersToCreateForCurrentExpense);
				}
				if (membersToRemoveForCurrentExpense.length > 0) {
					memberService.bulkRemove({
						_id: {
							$in: membersToRemoveForCurrentExpense.map(
								(m) => m.id
							),
						},
					});
				}
				if (membersToUpdateForCurrentExpense.length > 0) {
					memberService.bulkUpdate(
						membersToUpdateForCurrentExpense.map((m) => ({
							_id: m.id,
						})),
						membersToUpdateForCurrentExpense.map((m) => ({
							$set: {
								amount: m.amount,
								owed: m.amount,
								paid: 0,
							},
						}))
					);
				}
			} else {
				if (members.length === 1) {
					if (members[0].userId === currentMembersOfExpense.userId) {
						await memberService.update(
							{ id: currentMembersOfExpense.id },
							{ amount: amount, owed: amount, paid: 0 }
						);
					} else {
						await memberService.create({
							userId: members[0].userId,
							groupId: foundExpense.groupId,
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
							(m) => m.userId !== currentMembersOfExpense.userId
						)
						.map((member) => ({
							userId: member.userId,
							groupId: foundExpense.groupId,
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
			if (!foundGroup.members.find((m) => m === paidBy)) {
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