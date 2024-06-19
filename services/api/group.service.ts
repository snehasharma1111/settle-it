import {
	ExpenseModel,
	Group,
	GroupModel,
	MemberModel,
	User,
	UserModel,
} from "@/models";
import { expenseService, memberService } from "@/services/api";
import { IExpense } from "@/types/expense";
import { IGroup } from "@/types/group";
import { IBalance, ITransaction } from "@/types/member";
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
): Promise<IGroup | IGroup[] | null> => {
	const res = await GroupModel.find(query).populate("members createdBy");
	if (res.length > 1) {
		return res
			.map((obj) => parsePopulatedGroup(obj))
			.filter((obj) => obj !== null) as IGroup[];
	} else if (res.length === 1) {
		return parsePopulatedGroup(res[0]);
	}
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
	const res = await ExpenseModel.find({ groupId }).populate(
		"groupId paidBy createdBy"
	);
	return res.map((obj) => parsePopulatedExpense(obj) as IExpense);
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

export const getBalances = async (
	groupId: string
): Promise<Array<IBalance>> => {
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
	const userTransaction = new Map();

	// Hashmap to group transactions for each user
	result.forEach((result) => {
		const fromUser = result._id.userId.toString();
		const toUser = result._id.expensePaidBy.toString();
		const owed = result.totalOwed;
		const paid = result.totalPaid;
		if (!userTransaction.has(fromUser)) {
			userTransaction.set(fromUser, {
				user: fromUser,
				owed: 0,
				paid: 0,
				transactions: [],
			});
		}
		userTransaction.get(fromUser).owed += owed;
		userTransaction.get(fromUser).paid += paid;
		userTransaction.get(fromUser).transactions.push({
			user: toUser,
			owed: owed,
			paid: paid,
		});
	});

	// Convert to array format
	const userTransactionsArray = Array.from(userTransaction.values());

	// Get all user details
	const userIds = new Set();
	userTransactionsArray.forEach((userTrans) => {
		userIds.add(userTrans.user);
		userTrans.transactions.forEach((trans: any) => {
			userIds.add(trans.user);
		});
	});
	const users = await UserModel.find({
		_id: { $in: Array.from(userIds) },
	});

	// Populate user details
	const userMap = users.reduce((acc, user) => {
		acc[user._id] = getObjectFromMongoResponse<IUser>(user);
		return acc;
	}, {});
	userTransactionsArray.forEach((userTrans) => {
		userTrans.user = userMap[userTrans.user];
		userTrans.transactions.forEach((trans: any) => {
			trans.user = userMap[trans.user];
		});
	});

	return userTransactionsArray;
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
