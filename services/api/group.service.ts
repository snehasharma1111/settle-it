import { ExpenseModel, Group, GroupModel, MemberModel, User } from "@/models";
import { sendEmailTemplate } from "@/services";
import { expenseService, memberService, userService } from "@/services/api";
import { IExpense } from "@/types/expense";
import { IGroup } from "@/types/group";
import { IBalancesSummary, ITransaction, Transaction } from "@/types/member";
import { IUser } from "@/types/user";
import { getObjectFromMongoResponse } from "@/utils/parser";
import { getNonNullValue, getNumber } from "@/utils/safety";
import mongoose, { FilterQuery } from "mongoose";
import { parsePopulatedExpense } from "./expense.service";

export const parsePopulatedGroup = (group: Group): IGroup | null => {
	if (!group) return null;
	const res = getObjectFromMongoResponse<Group>(group);
	if (!res) return null;
	return {
		...res,
		createdBy: getObjectFromMongoResponse<User>(res.createdBy) as User,
		members: res.members
			.map((obj) => getObjectFromMongoResponse<User>(obj))
			.filter((obj) => obj !== null) as User[],
	};
};

export const findOne = async (
	query: Partial<Group>
): Promise<IGroup | null> => {
	const res = await GroupModel.findOne(query).populate("members createdBy");
	return parsePopulatedGroup(res);
};

export const findById = async (id: string): Promise<IGroup | null> => {
	const res = await GroupModel.findById(id)
		.populate("members createdBy")
		.catch((error: any) => {
			if (error.kind === "ObjectId") return null;
			return Promise.reject(error);
		});
	return parsePopulatedGroup(res);
};

export const find = async (
	query: FilterQuery<Group>
): Promise<IGroup[] | null> => {
	const res = await GroupModel.find(query).populate("members createdBy");
	const parsedRes = res
		.map((obj) => parsePopulatedGroup(obj))
		.filter((obj) => obj !== null) as IGroup[];
	if (parsedRes.length > 0) return parsedRes;
	return null;
};

export const findAll = async (): Promise<Array<IGroup>> => {
	const res = await GroupModel.find({})
		.sort({ createdAt: -1 })
		.populate("members createdBy");
	const parsedRes = res
		.map((obj) => parsePopulatedGroup(obj))
		.filter((obj) => obj !== null) as IGroup[];
	return parsedRes;
};

export const getGroupsUserIsPartOf = async (userId: string): Promise<any> => {
	const result = await GroupModel.find({
		members: { $in: [userId] },
	}).populate("members createdBy");
	const ans = result
		.map((obj) => parsePopulatedGroup(obj))
		.filter((obj) => obj !== null) as IGroup[];
	return ans;
};

export const getExpensesForGroup = async (
	groupId: string
): Promise<Array<IExpense>> => {
	const res = await ExpenseModel.find({ groupId })
		.populate("groupId paidBy createdBy")
		.populate({
			path: "groupId",
			populate: {
				path: "members createdBy",
			},
		});
	const expenses: Array<IExpense> = res
		.map(parsePopulatedExpense)
		.map(getNonNullValue);
	return expenses;
};

export const getExpenditure = async (groupId: string): Promise<number> => {
	const result = await ExpenseModel.aggregate([
		{
			$match: {
				groupId: new mongoose.Types.ObjectId(groupId),
			},
		},
		{
			$group: {
				_id: "$groupId",
				totalAmountSpent: { $sum: "$amount" },
			},
		},
		{
			$project: {
				_id: 0,
				groupId: "$_id",
				totalAmountSpent: 1,
			},
		},
	]);
	if (result.length === 0) {
		return 0;
	}
	return result[0].totalAmountSpent;
};

export const getAllTransactions = async (
	groupId: string
): Promise<Array<ITransaction>> => {
	const result = await MemberModel.aggregate([
		// get members involved in this group
		{
			$match: {
				groupId: new mongoose.Types.ObjectId(groupId),
			},
		},
		// populate expenses in every member
		{
			$lookup: {
				from: "expenses",
				localField: "expenseId",
				foreignField: "_id",
				as: "expense",
			},
		},
		// only get first expense from the array
		{
			$unwind: "$expense",
		},
		// populate user
		{
			$lookup: {
				from: "users",
				localField: "userId",
				foreignField: "_id",
				as: "user",
			},
		},
		// only get first user from the array
		{
			$unwind: "$user",
		},
		// populate expense.paidBy
		{
			$lookup: {
				from: "users",
				localField: "expense.paidBy",
				foreignField: "_id",
				as: "expense.paidBy",
			},
		},
		// only get first user from the array
		{
			$unwind: "$expense.paidBy",
		},
		{
			$project: {
				_id: 0,
				title: "$expense.title",
				from: "$user",
				to: "$expense.paidBy",
				owed: "$owed",
				paid: "$paid",
			},
		},
	]);
	return result.map((obj: any) => ({
		...obj,
		from: getObjectFromMongoResponse<IUser>(obj.from),
		to: getObjectFromMongoResponse<IUser>(obj.to),
		owed: getNumber(obj.owed),
		paid: getNumber(obj.paid),
	}));
};

export const getAllTransactionsForGroup = async (
	groupId: string
): Promise<Array<Transaction>> => {
	const result = await MemberModel.aggregate([
		// get members involved in this group
		{
			$match: {
				groupId: new mongoose.Types.ObjectId(groupId),
			},
		},
		// populate expenses in every member
		{
			$lookup: {
				from: "expenses",
				localField: "expenseId",
				foreignField: "_id",
				as: "expense",
			},
		},
		// only get first expense from the array
		{
			$unwind: "$expense",
		},
		// group by member.userId and member.expense.paidBy
		{
			$group: {
				_id: {
					userId: "$userId",
					expensePaidBy: "$expense.paidBy",
				},
				totalOwed: { $sum: "$owed" },
				totalPaid: { $sum: "$paid" },
			},
		},
	]);
	// buld the summary array of 'from-to-stillOwes-hasPaid'
	const transactions: Array<Transaction> = result
		.map((a) => ({
			from: a._id.userId.toString(),
			to: a._id.expensePaidBy.toString(),
			stillOwes: a.totalOwed,
			hasPaid: a.totalPaid,
		}))
		.filter((a) => a.from !== a.to)
		.filter((a) => a.stillOwes > 0 || a.hasPaid > 0)
		.map((a) => ({
			from: a.from,
			to: a.to,
			owed: a.stillOwes,
			paid: a.hasPaid,
		}));
	return transactions;
};

export const getOwedBalances = (
	transactions: Array<Transaction>,
	usersMap: Map<string, IUser>
): IBalancesSummary["owes"] => {
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
				const fromInToBucketOfOwesMap = toInOwesMap.transactions.find(
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
						fromInToBucketOfOwesMap.amount = prevAmount - newAmount;
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
				const fromInToBucketOfOwesMap = toInOwesMap.transactions.find(
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
						fromInToBucketOfOwesMap.amount = prevAmount - newAmount;
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
	const owesArray = Array.from(owesMap, ([fromUser, fromUserObject]) => ({
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

	return owesArray;
};

export const getSummaryBalances = (
	transactions: Array<Transaction>,
	usersMap: Map<string, IUser>
): IBalancesSummary["balances"] => {
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
			if (fromInToBucketOfBalancesMap && toInFromBucketOfBalancesMap) {
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
					fromInToBucketOfBalancesMap.gives = prevAmount - newAmount;
					toInFromBucketOfBalancesMap.gets = prevAmount - newAmount;
				} else {
					fromInToBucketOfBalancesMap.gives = 0;
					fromInToBucketOfBalancesMap.gets = newAmount - prevAmount;
					toInFromBucketOfBalancesMap.gives = newAmount - prevAmount;
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
	const balancesArray = Array.from(
		balancesMap,
		([fromUser, fromUserObject]) => {
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
		}
	)
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

	return balancesArray;
};

export const create = async (
	body: Omit<Group, "id" | "createdAt" | "updatedAt">
): Promise<IGroup> => {
	const res = await GroupModel.create(body);
	await res.populate("members createdBy");
	return getNonNullValue(parsePopulatedGroup(res));
};

export const update = async (
	query: Partial<Group>,
	update: Partial<Omit<Group, "id" | "createdAt" | "updatedAt">>
): Promise<IGroup | null> => {
	const res = query.id
		? await GroupModel.findByIdAndUpdate(query.id, update, {
				new: true,
			}).populate("members createdBy")
		: await GroupModel.findOneAndUpdate(query, update, {
				new: true,
			}).populate("members createdBy");
	return parsePopulatedGroup(res);
};

export const remove = async (query: Partial<Group>): Promise<IGroup | null> => {
	const res = query.id
		? await GroupModel.findByIdAndDelete(query.id).populate(
				"members createdBy"
			)
		: await GroupModel.findOneAndDelete(query).populate(
				"members createdBy"
			);
	return parsePopulatedGroup(res);
};

export const clear = async (id: string): Promise<boolean> => {
	const group = await findById(id);
	if (!group) return false;
	await memberService.bulkRemove({
		groupId: id,
	});
	await expenseService.removeMultiple({
		groupId: id,
	});
	return true;
};

export const addMembers = async (
	groupId: string,
	newMembers: Array<string>
): Promise<IGroup | null> => {
	const updatedGroup = await GroupModel.findByIdAndUpdate(groupId, {
		$push: { members: { $each: newMembers } },
	}).populate("members createdBy");
	return parsePopulatedGroup(updatedGroup);
};

export const removeMembers = async (
	groupId: string,
	members: Array<string>
): Promise<IGroup | null> => {
	const updatedGroup = await GroupModel.findByIdAndUpdate(groupId, {
		$pull: { members: { $in: members } },
	}).populate("members createdBy");
	return parsePopulatedGroup(updatedGroup);
};

export const sendInvitationToUsers = async (
	group: { name: string; id: string },
	users: Array<string>,
	invitedBy: string
): Promise<void> => {
	try {
		const invitedByUser = await userService.findById(invitedBy);
		const allUsers = await userService.find({ _id: { $in: users } });
		if (!allUsers || !invitedByUser || !group)
			return console.error("Could not send invitation to users");
		await Promise.all(
			allUsers.map(async (user) => {
				await sendEmailTemplate(
					user.email,
					`${invitedByUser.name} has added you to ${group.name}`,
					"USER_ADDED_TO_GROUP",
					{
						invitedBy: {
							email: invitedByUser.email,
							name: invitedByUser.name,
						},
						group: {
							id: group.id,
							name: group.name,
						},
					}
				);
			})
		);
	} catch (error) {
		console.error(error);
	}
};
