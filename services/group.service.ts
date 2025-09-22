import { Cache } from "@/cache";
import { cacheParameter, HTTP } from "@/constants";
import { ApiError } from "@/errors";
import { expenseRepo, groupRepo, memberRepo, userRepo } from "@/repo";
import {
	CreateModel,
	IBalancesSummary,
	IGroup,
	IShare,
	ITransaction,
	IUser,
	Transaction,
} from "@/types";
import { getNonNullValue, simplifyFraction } from "@/utils";
import { CacheService } from "./cache.service";
import { ExpenseService } from "./expense.service";
import { UserService } from "./user.service";
import { EmailService } from "@/services/email";
import { Group } from "@/schema";

export class GroupService {
	public static async getAllGroups(): Promise<Array<IGroup>> {
		return await groupRepo.findAll();
	}
	public static async getGroupById(id: string): Promise<IGroup | null> {
		return await CacheService.fetch(
			CacheService.getKey(cacheParameter.GROUP, { id }),
			() => groupRepo.findById(id)
		);
	}
	private static async clear(id: string): Promise<boolean> {
		const group = await GroupService.getGroupById(id);
		if (!group) return false;
		await Promise.all([
			memberRepo.bulkRemove({ groupId: id }),
			expenseRepo.removeMultiple({ groupId: id }),
		]);
		Cache.del(
			CacheService.getKey(cacheParameter.GROUP_EXPENSES, { groupId: id })
		);
		return true;
	}
	private static async addMembers(
		groupId: string,
		newMembers: Array<string>
	): Promise<IGroup | null> {
		return await groupRepo.update(
			{ id: groupId },
			{ $push: { members: { $each: newMembers } } }
		);
	}
	private static async removeMembers(
		groupId: string,
		members: Array<string>
	): Promise<IGroup | null> {
		return await groupRepo.update(
			{ id: groupId },
			{ $pull: { members: { $in: members } } }
		);
	}
	public static async getGroupsUserIsPartOf(
		userId: string
	): Promise<Array<IGroup>> {
		const groups = await CacheService.fetch(
			CacheService.getKey(cacheParameter.USER_GROUPS, { userId }),
			() => groupRepo.find({ members: { $in: [userId] } })
		);
		if (!groups) return [];
		return groups;
	}
	public static async getGroupDetails(groupId: string) {
		const group = await GroupService.getGroupById(groupId);
		if (!group) {
			throw new ApiError(HTTP.status.NOT_FOUND, "Group not found");
		}
		return group;
	}
	public static async getGroupDetailsForUser(
		userId: string,
		groupId: string
	): Promise<IGroup> {
		const group = await GroupService.getGroupDetails(groupId);
		if (!group.members.map((member) => member.id).includes(userId)) {
			throw new ApiError(
				HTTP.status.FORBIDDEN,
				"User is not a member of this group"
			);
		}
		return group;
	}
	public static async getGroupDetailsForGroupAdmin(
		userId: string,
		groupId: string
	): Promise<IGroup> {
		const group = await GroupService.getGroupDetails(groupId);
		if (group.createdBy.id !== userId) {
			throw new ApiError(
				HTTP.status.FORBIDDEN,
				"User is not an admin of this group"
			);
		}
		return group;
	}
	public static async getGroupExpenses(groupId: string) {
		const expenses = await ExpenseService.getExpensesForGroup(groupId);
		if (!expenses) return [];
		return expenses;
	}
	public static async sendInvitationToUsers(
		group: { name: string; id: string },
		users: Array<string>,
		invitedBy: string
	): Promise<void> {
		const invitedByUser = await UserService.getUserById(invitedBy);
		const allUsers = await userRepo.find({ _id: { $in: users } });
		if (!allUsers || !invitedByUser || !group) {
			throw new ApiError(
				HTTP.status.NOT_FOUND,
				"Could not send invitation to users"
			);
		}
		await Promise.all(
			allUsers.map((user) => {
				return EmailService.sendByTemplate(
					user.email,
					`${invitedByUser.name} has added you to ${group.name}`,
					"USER_ADDED_TO_GROUP",
					{
						invitedBy: {
							email: invitedByUser.email,
							name: invitedByUser.name || "",
						},
						group: {
							id: group.id,
							name: group.name,
						},
					}
				);
			})
		);
	}
	public static async createGroup({
		body,
		authorId,
	}: {
		body: Omit<CreateModel<Group>, "createdBy">;
		authorId: string;
	}): Promise<IGroup> {
		if (!body.members.includes(authorId)) {
			body.members.push(authorId);
		}
		if (body.members.length <= 1) {
			throw new ApiError(
				HTTP.status.BAD_REQUEST,
				"Group must have at least 2 members"
			);
		}
		Cache.invalidate(
			CacheService.getKey(cacheParameter.USER_GROUPS, {
				userId: authorId,
			})
		);
		const payload = {
			...body,
			createdBy: authorId,
		};
		const createdGroup = await groupRepo.create(payload);
		await GroupService.sendInvitationToUsers(
			{ name: createdGroup.name, id: createdGroup.id },
			body.members.filter((m) => m !== authorId),
			authorId
		);
		return createdGroup;
	}
	public static async updateGroupDetails({
		groupId,
		authorId,
		updateBody,
	}: {
		groupId: string;
		authorId: string;
		updateBody: Partial<Group>;
	}) {
		const foundGroup = await GroupService.getGroupDetailsForUser(
			authorId,
			groupId
		);
		if (updateBody.members) {
			if (!updateBody.members.includes(authorId)) {
				updateBody.members.push(authorId);
			}
			// get removed members list
			const removedMembers = foundGroup.members
				.map((member) => member.id)
				.filter((member) => !updateBody.members!.includes(member));
			if (removedMembers.length > 0) {
				// check is removed user have any pending transactions
				const pendingTransactions = await memberRepo.find({
					userId: { $in: removedMembers },
					groupId,
					owed: { $gt: 0 },
				});
				if (!pendingTransactions) {
					GroupService.removeMembers(groupId, removedMembers);
				} else if (pendingTransactions.length > 0) {
					throw new ApiError(
						HTTP.status.BAD_REQUEST,
						"One (or more) removed users have pending transactions"
					);
				}
			}
		}
		Cache.invalidate(
			CacheService.getKey(cacheParameter.USER_GROUPS, {
				userId: authorId,
			})
		);
		Cache.invalidate(
			CacheService.getKey(cacheParameter.GROUP, { id: groupId })
		);
		return await groupRepo.update({ id: groupId }, updateBody);
	}
	public static async deleteGroup({
		groupId,
		loggedInUserId,
	}: {
		groupId: string;
		loggedInUserId: string;
	}) {
		await GroupService.getGroupDetailsForGroupAdmin(
			loggedInUserId,
			groupId
		);
		await GroupService.clear(groupId);
		const deletedGroup = await groupRepo.remove({ id: groupId });
		Cache.invalidate(
			CacheService.getKey(cacheParameter.USER_GROUPS, {
				userId: loggedInUserId,
			})
		);
		Cache.del(CacheService.getKey(cacheParameter.GROUP, { id: groupId }));
		return deletedGroup;
	}
	public static async addMembersInGroup({
		groupId,
		loggedInUserId,
		members,
	}: {
		groupId: string;
		loggedInUserId: string;
		members: Array<string>;
	}) {
		const foundGroup = await GroupService.getGroupDetailsForGroupAdmin(
			loggedInUserId,
			groupId
		);
		if (members.length === 0) {
			throw new ApiError(
				HTTP.status.BAD_REQUEST,
				"No members to add in group"
			);
		}
		const existingMemberIds = foundGroup.members.map((member) => member.id);
		const membersToAdd = members.filter(
			(member) => !existingMemberIds.includes(member)
		);
		if (membersToAdd.length === 0) {
			throw new ApiError(
				HTTP.status.BAD_REQUEST,
				"No new members to add in group"
			);
		}
		const updatedGroup = await GroupService.addMembers(
			groupId,
			membersToAdd
		);
		Cache.invalidate(
			CacheService.getKey(cacheParameter.GROUP_EXPENSES, { groupId })
		);
		Cache.invalidate(
			CacheService.getKey(cacheParameter.USER_GROUPS, {
				userId: loggedInUserId,
			})
		);
		Cache.invalidate(
			CacheService.getKey(cacheParameter.GROUP, { id: groupId })
		);
		return updatedGroup;
	}
	public static async removeMembersFromGroup({
		groupId,
		loggedInUserId,
		members,
	}: {
		groupId: string;
		loggedInUserId: string;
		members: Array<string>;
	}) {
		const foundGroup = await GroupService.getGroupDetailsForGroupAdmin(
			loggedInUserId,
			groupId
		);
		const membersToRemove = members.filter((member) =>
			foundGroup.members.map((member) => member.id).includes(member)
		);
		const updatedGroup = await GroupService.removeMembers(
			groupId,
			membersToRemove
		);
		Cache.invalidate(
			CacheService.getKey(cacheParameter.GROUP_EXPENSES, { groupId })
		);
		Cache.invalidate(
			CacheService.getKey(cacheParameter.USER_GROUPS, {
				userId: loggedInUserId,
			})
		);
		Cache.invalidate(
			CacheService.getKey(cacheParameter.GROUP, { id: groupId })
		);
		return updatedGroup;
	}
	public static getOwedBalances(
		transactions: Array<Transaction>,
		usersMap: Map<string, IUser>
	): IBalancesSummary["owes"] {
		// build the map for all the amount that is still owed by every user
		const owesMap = new Map<
			string,
			{ transactions: { user: string; amount: number }[] }
		>();
		transactions.forEach((transaction) => {
			const from = transaction.from;
			const to = transaction.to;
			const fromInOwesMap = owesMap.get(from);
			const toInOwesMap = owesMap.get(to);
			if (transaction.owed !== 0) {
				if (fromInOwesMap && toInOwesMap) {
					const fromInToBucketOfOwesMap =
						toInOwesMap.transactions.find(
							(t: any) => t.user === from
						);
					if (fromInToBucketOfOwesMap) {
						const prevAmount = fromInToBucketOfOwesMap.amount;
						const newAmount = transaction.owed;
						if (prevAmount === newAmount) {
							// remove 'from' from 'to' bucket
							toInOwesMap.transactions =
								toInOwesMap.transactions.filter(
									(t: any) => t.user !== from
								);
						} else if (prevAmount > newAmount) {
							// reduce amount of 'from' in 'to' bucket
							fromInToBucketOfOwesMap.amount =
								prevAmount - newAmount;
						} else if (prevAmount < newAmount) {
							// remove 'from' from 'to' bucket and add reduced amount to 'from' bucket
							toInOwesMap.transactions =
								toInOwesMap.transactions.filter(
									(t: any) => t.user !== from
								);
							fromInOwesMap.transactions.push({
								user: to,
								amount: newAmount - prevAmount,
							});
						}
					} else {
						fromInOwesMap.transactions.push({
							user: to,
							amount: transaction.owed,
						});
					}
				} else if (fromInOwesMap) {
					fromInOwesMap.transactions.push({
						user: to,
						amount: transaction.owed,
					});
				} else if (toInOwesMap) {
					const fromInToBucketOfOwesMap =
						toInOwesMap.transactions.find(
							(t: any) => t.user === from
						);
					if (fromInToBucketOfOwesMap) {
						const prevAmount = fromInToBucketOfOwesMap.amount;
						const newAmount = transaction.owed;
						if (prevAmount === newAmount) {
							// remove 'from' from 'to' bucket
							toInOwesMap.transactions =
								toInOwesMap.transactions.filter(
									(t: any) => t.user !== from
								);
						} else if (prevAmount > newAmount) {
							fromInToBucketOfOwesMap.amount =
								prevAmount - newAmount;
						} else {
							// kick 'from' from the bucket
							toInOwesMap.transactions =
								toInOwesMap.transactions.filter(
									(t: any) => t.user !== from
								);
							// add 'to' to the map
							owesMap.set(from, {
								transactions: [
									{
										user: to,
										amount: newAmount - prevAmount,
									},
								],
							});
						}
					} else {
						owesMap.set(from, {
							transactions: [
								{
									user: to,
									amount: transaction.owed,
								},
							],
						});
					}
				} else {
					owesMap.set(from, {
						transactions: [
							{
								user: to,
								amount: transaction.owed,
							},
						],
					});
				}
			}
		});
		// populate the owes array with all the users

		return Array.from(owesMap, ([fromUser, fromUserObject]) => ({
			user: fromUser,
			...fromUserObject,
		}))
			.map((obj) => {
				return {
					user: getNonNullValue(usersMap.get(obj.user)),
					amount: obj.transactions
						.map((t) => t.amount)
						.reduce((a, b) => a + b, 0),
					transactions: obj.transactions.map((t) => {
						return {
							user: getNonNullValue(usersMap.get(t.user)),
							amount: t.amount,
						};
					}),
				};
			})
			.filter((obj) => obj.amount > 0 && obj.transactions.length > 0);
	}
	public static getSummaryBalances(
		transactions: Array<Transaction>,
		usersMap: Map<string, IUser>
	): IBalancesSummary["balances"] {
		// build the map for the summary for every user
		const balancesMap = new Map<
			string,
			{ transactions: { user: string; gives: number; gets: number }[] }
		>();
		transactions.forEach((transaction) => {
			const from = transaction.from;
			const to = transaction.to;
			const fromInBalancesMap = balancesMap.get(from);
			const toInBalancesMap = balancesMap.get(to);
			if (fromInBalancesMap && toInBalancesMap) {
				const fromInToBucketOfBalancesMap =
					toInBalancesMap.transactions.find((t) => t.user === from);
				const toInFromBucketOfBalancesMap =
					fromInBalancesMap.transactions.find((t) => t.user === to);
				if (
					fromInToBucketOfBalancesMap &&
					toInFromBucketOfBalancesMap
				) {
					const prevAmount = fromInToBucketOfBalancesMap.gives;
					const newAmount = transaction.paid + transaction.owed;
					if (prevAmount === newAmount) {
						// kick both from each others bucket
						toInBalancesMap.transactions =
							toInBalancesMap.transactions.filter(
								(t) => t.user !== from
							);
						fromInBalancesMap.transactions =
							fromInBalancesMap.transactions.filter(
								(t) => t.user !== to
							);
					} else if (prevAmount > newAmount) {
						fromInToBucketOfBalancesMap.gives =
							prevAmount - newAmount;
						toInFromBucketOfBalancesMap.gets =
							prevAmount - newAmount;
					} else {
						fromInToBucketOfBalancesMap.gives = 0;
						fromInToBucketOfBalancesMap.gets =
							newAmount - prevAmount;
						toInFromBucketOfBalancesMap.gives =
							newAmount - prevAmount;
						toInFromBucketOfBalancesMap.gets = 0;
					}
				} else {
					fromInBalancesMap.transactions.push({
						user: to,
						gives: transaction.paid + transaction.owed,
						gets: 0,
					});
					toInBalancesMap.transactions.push({
						user: from,
						gives: 0,
						gets: transaction.paid + transaction.owed,
					});
				}
			} else if (fromInBalancesMap) {
				fromInBalancesMap.transactions.push({
					user: to,
					gives: transaction.paid + transaction.owed,
					gets: 0,
				});
				balancesMap.set(to, {
					transactions: [
						{
							user: from,
							gives: 0,
							gets: transaction.paid + transaction.owed,
						},
					],
				});
			} else if (toInBalancesMap) {
				toInBalancesMap.transactions.push({
					user: from,
					gives: 0,
					gets: transaction.paid + transaction.owed,
				});
				balancesMap.set(from, {
					transactions: [
						{
							user: to,
							gives: transaction.paid + transaction.owed,
							gets: 0,
						},
					],
				});
			} else {
				balancesMap.set(from, {
					transactions: [
						{
							user: to,
							gives: transaction.paid + transaction.owed,
							gets: 0,
						},
					],
				});
				balancesMap.set(to, {
					transactions: [
						{
							user: from,
							gives: 0,
							gets: transaction.paid + transaction.owed,
						},
					],
				});
			}
		});
		// populate the summary array with all the users

		return Array.from(balancesMap, ([fromUser, fromUserObject]) => {
			const gives = fromUserObject.transactions
				.map((t: any) => t.gives)
				.reduce((a: number, b: number) => a + b, 0);
			const gets = fromUserObject.transactions
				.map((t: any) => t.gets)
				.reduce((a: number, b: number) => a + b, 0);
			const givesInTotal = gives > gets ? gives - gets : 0;
			const getsInTotal = gets > gives ? gets - gives : 0;
			return {
				user: fromUser,
				gives: givesInTotal,
				gets: getsInTotal,
				...fromUserObject,
			};
		})
			.filter((obj) => obj.gives > 0 || obj.gets > 0)
			.map((obj) => {
				return {
					user: getNonNullValue(usersMap.get(obj.user)),
					gives: obj.gives,
					gets: obj.gets,
					transactions: obj.transactions.map((t) => {
						return {
							user: getNonNullValue(usersMap.get(t.user)),
							gives: t.gives,
							gets: t.gets,
						};
					}),
				};
			});
	}
	public static async getGroupSummary(groupId: string): Promise<{
		expenditure: number;
		balances: IBalancesSummary;
		shares: Array<IShare>;
	}> {
		const [expenditure, allTransactionsForGroup] = await Promise.all([
			expenseRepo.getExpenditureForGroup(groupId),
			memberRepo.getAllTransactionsSummaryForGroup(groupId),
		]);
		// get all users in this group
		const membersIds = Array.from(
			new Set(
				allTransactionsForGroup
					.map((t) => t.from)
					.concat(allTransactionsForGroup.map((t) => t.to))
			)
		);
		const usersMap = await UserService.getUsersMapForUserIds(membersIds);
		const balances = {
			owes: GroupService.getOwedBalances(
				allTransactionsForGroup,
				usersMap
			),
			balances: GroupService.getSummaryBalances(
				allTransactionsForGroup,
				usersMap
			),
		};
		const shares = await GroupService.getShares({
			groupId,
			totalAmount: expenditure,
			usersMap,
		});
		return { expenditure, balances, shares };
	}
	public static async getAllGroupTransactions(
		groupId: string
	): Promise<{ expenditure: number; transactions: Array<ITransaction> }> {
		const [expenditure, transactions] = await Promise.all([
			expenseRepo.getExpenditureForGroup(groupId),
			memberRepo.getAllTransactionsForGroup(groupId),
		]);
		return { expenditure, transactions };
	}
	public static async getShares({
		groupId,
		totalAmount,
		usersMap,
	}: {
		groupId: string;
		totalAmount: number;
		usersMap: Map<string, IUser>;
	}): Promise<Array<IShare>> {
		const shares = await memberRepo.getSharesForGroup(groupId);
		const max = Math.max(...shares.map((s) => s.amount));
		const min = Math.min(...shares.map((s) => s.amount));
		const range = max - min;
		const populatedShares = shares.map((share) => {
			return {
				user: getNonNullValue(usersMap.get(share.user)),
				amount: share.amount,
				percentage: +((share.amount / totalAmount) * 100).toFixed(2),
				fraction: simplifyFraction(
					`${share.amount.toFixed(2)}/${totalAmount}`
				),
			};
		});

		return populatedShares
			.map((share) => {
				return {
					user: share.user,
					amount: share.amount,
					percentage: share.percentage,
					fraction: share.fraction,
					opacity:
						range === 0
							? 1
							: ((share.amount - min) / range) * 0.7 + 0.3, // Scale from 0.3 to 1
				};
			})
			.sort((a, b) => b.amount - a.amount);
	}
}
