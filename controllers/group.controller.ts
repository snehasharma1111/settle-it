import { HTTP } from "@/constants";
import logger from "@/log";
import { Group } from "@/models";
import { groupService, memberService, userService } from "@/services/api";
import cache from "@/services/cache";
import { ApiRequest, ApiResponse } from "@/types/api";
import { cacheParameter, getCacheKey } from "@/utils/cache";
import {
	genericParse,
	getArray,
	getNonEmptyString,
	safeParse,
} from "@/utils/safety";

export const getAllGroups = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const loggedInUserId = getNonEmptyString(req.user?.id);
		// search for group whose members array contains loggedInUserId
		const groups = await cache.fetch(
			getCacheKey(cacheParameter.USER_GROUPS, { userId: loggedInUserId }),
			() => {
				return groupService.getGroupsUserIsPartOf(loggedInUserId);
			}
		);
		return res
			.status(HTTP.status.SUCCESS)
			.json({ message: HTTP.message.SUCCESS, data: groups });
	} catch (error) {
		return res
			.status(HTTP.status.INTERNAL_SERVER_ERROR)
			.json({ message: HTTP.message.INTERNAL_SERVER_ERROR });
	}
};

export const getGroupDetailsAndExpenses = async (
	req: ApiRequest,
	res: ApiResponse
) => {
	try {
		const loggedInUserId = getNonEmptyString(req.user?.id);
		const groupId = getNonEmptyString(req.query.id);
		const group = await groupService.findById(groupId);
		if (!group)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		// if logged in user is not in the members list of the group, then return forbidden
		if (!group.members.map((u) => u.id).includes(loggedInUserId))
			return res
				.status(HTTP.status.FORBIDDEN)
				.json({ message: HTTP.message.FORBIDDEN });
		const expenses = await cache.fetch(
			getCacheKey(cacheParameter.GROUP_EXPENSES, { groupId }),
			() => {
				return groupService.getExpensesForGroup(groupId);
			}
		);
		return res.status(HTTP.status.SUCCESS).json({
			message: HTTP.message.SUCCESS,
			data: {
				group,
				expenses,
			},
		});
	} catch (error) {
		return res
			.status(HTTP.status.INTERNAL_SERVER_ERROR)
			.json({ message: HTTP.message.INTERNAL_SERVER_ERROR });
	}
};

export const getBalancesSummary = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const loggedInUserId = getNonEmptyString(req.user?.id);
		const groupId = getNonEmptyString(req.query.id);
		const group = await groupService.findById(groupId);
		if (!group)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		// if logged in user is not in the members list of the group, then return forbidden
		if (!group.members.map((u) => u.id).includes(loggedInUserId))
			return res
				.status(HTTP.status.FORBIDDEN)
				.json({ message: HTTP.message.FORBIDDEN });
		const expenditure = await groupService.getExpenditure(groupId);
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
		const balances = {
			owes: groupService.getOwedBalances(
				allTransactionsForGroup,
				usersMap
			),
			balances: groupService.getSummaryBalances(
				allTransactionsForGroup,
				usersMap
			),
		};
		return res.status(HTTP.status.SUCCESS).json({
			message: HTTP.message.SUCCESS,
			data: {
				group,
				expenditure,
				balances,
			},
		});
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

export const getGroupTransactions = async (
	req: ApiRequest,
	res: ApiResponse
) => {
	try {
		const loggedInUserId = getNonEmptyString(req.user?.id);
		const groupId = getNonEmptyString(req.query.id);
		const group = await groupService.findById(groupId);
		if (!group)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		// if logged in user is not in the members list of the group, then return forbidden
		if (!group.members.map((u) => u.id).includes(loggedInUserId))
			return res
				.status(HTTP.status.FORBIDDEN)
				.json({ message: HTTP.message.FORBIDDEN });
		const expenditure = await groupService.getExpenditure(groupId);
		const transactions = await groupService.getAllTransactions(groupId);
		return res.status(HTTP.status.SUCCESS).json({
			message: HTTP.message.SUCCESS,
			data: {
				group,
				expenditure,
				transactions,
			},
		});
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

export const createGroup = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const name = genericParse(getNonEmptyString, req.body.name);
		const icon = safeParse(getNonEmptyString, req.body.icon);
		const banner = safeParse(getNonEmptyString, req.body.banner);
		const type = safeParse(getNonEmptyString, req.body.type);
		const loggedInUserId = getNonEmptyString(req.user?.id);
		const members = safeParse(getArray<string>, req.body.members) || [
			loggedInUserId,
		];
		if (!members.includes(loggedInUserId)) {
			members.push(loggedInUserId);
		}
		if (members.length <= 1) {
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: "Group must have at least 2 members" });
		}
		const foundGroup = await groupService.findOne({ name });
		if (foundGroup)
			return res
				.status(HTTP.status.CONFLICT)
				.json({ message: "Group already exists" });
		const newGroupBody: Omit<Group, "id" | "createdAt" | "updatedAt"> = {
			name,
			createdBy: loggedInUserId,
			members,
		};
		if (icon) newGroupBody.icon = icon;
		if (banner) newGroupBody.banner = banner;
		if (type) newGroupBody.type = type;
		const createdGroup = await groupService.create(newGroupBody);
		cache.invalidate(
			getCacheKey(cacheParameter.USER_GROUPS, { userId: loggedInUserId })
		);
		await groupService.sendInvitationToUsers(
			{ name: createdGroup.name, id: createdGroup.id },
			members.filter((m) => m !== loggedInUserId),
			loggedInUserId
		);
		return res.status(HTTP.status.CREATED).json({
			message: "Group created successfully",
			data: createdGroup,
		});
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

export const updateGroup = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const loggedInUserId = getNonEmptyString(req.user?.id);
		const id = getNonEmptyString(req.query.id);
		const name = safeParse(getNonEmptyString, req.body.name);
		const icon = safeParse(getNonEmptyString, req.body.icon);
		const banner = safeParse(getNonEmptyString, req.body.banner);
		const type = safeParse(getNonEmptyString, req.body.type);
		const members = safeParse(getArray<string>, req.body.members);
		if (!id || !loggedInUserId)
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: HTTP.message.BAD_REQUEST });
		const foundGroup = await groupService.findById(id);
		if (!foundGroup)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		const newGroupBody: Partial<Group> = {};
		if (name) newGroupBody.name = name;
		if (icon) newGroupBody.icon = icon;
		if (banner) newGroupBody.banner = banner;
		if (type) newGroupBody.type = type;
		if (members) {
			if (!members.includes(loggedInUserId)) {
				members.push(loggedInUserId);
			}
			newGroupBody.members = members;
			// get removed members list
			const removedMembers = foundGroup.members
				.map((member) => member.id)
				.filter((member) => !members.includes(member));
			if (removedMembers.length > 0) {
				// check is removed user have any pending transactions
				const pendingTransactions = await memberService.find({
					userId: { $in: removedMembers },
					groupId: id,
					owed: { $gt: 0 },
				});
				if (!pendingTransactions)
					await groupService.removeMembers(id, removedMembers);
				else if (pendingTransactions.length > 0) {
					return res.status(HTTP.status.BAD_REQUEST).json({
						message:
							"One (or more) removed users have pending transactions",
					});
				}
			}
		}
		const updatedGroup = await groupService.update({ id }, newGroupBody);
		cache.invalidate(
			getCacheKey(cacheParameter.GROUP_EXPENSES, { groupId: id })
		);
		return res.status(HTTP.status.SUCCESS).json({
			message: HTTP.message.SUCCESS,
			data: updatedGroup,
		});
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

export const deleteGroup = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const loggedInUserId = getNonEmptyString(req.user?.id);
		const id = getNonEmptyString(req.query.id);
		if (!id || !loggedInUserId)
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: HTTP.message.BAD_REQUEST });
		const foundGroup = await groupService.findById(id);
		if (!foundGroup)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		if (foundGroup.createdBy.id !== loggedInUserId)
			return res.status(HTTP.status.FORBIDDEN).json({
				message: "Only the creator can destory it's creation",
			});
		await groupService.clear(id);
		const deletedGroup = await groupService.remove({ id });
		cache.del(getCacheKey(cacheParameter.GROUP_EXPENSES, { groupId: id }));
		cache.invalidate(
			getCacheKey(cacheParameter.USER_GROUPS, { userId: id })
		);
		return res.status(HTTP.status.SUCCESS).json({
			message: HTTP.message.SUCCESS,
			data: deletedGroup,
		});
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

export const addGroupMembers = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const loggedInUserId = getNonEmptyString(req.user?.id);
		const id = getNonEmptyString(req.query.id);
		const members = genericParse(getArray<string>, req.body.members);
		if (members.length === 0)
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: HTTP.message.BAD_REQUEST });
		const foundGroup = await groupService.findById(id);
		if (!foundGroup)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		if (foundGroup.createdBy.id !== loggedInUserId)
			return res
				.status(HTTP.status.FORBIDDEN)
				.json({ message: HTTP.message.FORBIDDEN });
		const membersToAdd = members.filter(
			(member) =>
				!foundGroup.members.map((member) => member.id).includes(member)
		);
		const updatedGroup = await groupService.addMembers(id, membersToAdd);
		cache.invalidate(
			getCacheKey(cacheParameter.GROUP_EXPENSES, { groupId: id })
		);
		cache.invalidate(
			getCacheKey(cacheParameter.USER_GROUPS, { userId: id })
		);
		return res.status(HTTP.status.SUCCESS).json({
			message: HTTP.message.SUCCESS,
			data: updatedGroup,
		});
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

export const removeGroupMembers = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const loggedInUserId = getNonEmptyString(req.user?.id);
		const id = getNonEmptyString(req.query.id);
		const members = genericParse(getArray<string>, req.body.members);
		if (members.length === 0)
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: HTTP.message.BAD_REQUEST });
		const foundGroup = await groupService.findById(id);
		if (!foundGroup)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		if (foundGroup.createdBy.id !== loggedInUserId)
			return res
				.status(HTTP.status.FORBIDDEN)
				.json({ message: HTTP.message.FORBIDDEN });
		const membersToRemove = members.filter((member) =>
			foundGroup.members.map((member) => member.id).includes(member)
		);
		const updatedGroup = await groupService.removeMembers(
			id,
			membersToRemove
		);
		cache.invalidate(
			getCacheKey(cacheParameter.GROUP_EXPENSES, { groupId: id })
		);
		cache.invalidate(
			getCacheKey(cacheParameter.USER_GROUPS, { userId: id })
		);
		return res.status(HTTP.status.SUCCESS).json({
			message: HTTP.message.SUCCESS,
			data: updatedGroup,
		});
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
