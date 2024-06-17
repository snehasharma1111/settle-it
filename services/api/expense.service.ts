import { Expense, ExpenseModel } from "@/models";
import { IExpense } from "@/types/expense";
import { IGroup } from "@/types/group";
import { IUser } from "@/types/user";
import { omitKeys } from "@/utils/functions";
import { getObjectFromMongoResponse } from "@/utils/parser";
import { getNonNullValue } from "@/utils/safety";
import { FilterQuery } from "mongoose";
import { expenseService, groupService } from ".";

export const parsePopulatedExpense = (expense: Expense): IExpense | null => {
	if (!expense) return null;
	const res = getObjectFromMongoResponse<Expense>(expense);
	if (!res) return null;
	return {
		...omitKeys(res, ["groupId"]),
		group: getObjectFromMongoResponse<IGroup>(res.groupId) as IGroup,
		paidBy: getObjectFromMongoResponse<IUser>(res.paidBy) as IUser,
		createdBy: getObjectFromMongoResponse<IUser>(res.createdBy) as IUser,
	};
};

export const findOne = async (
	query: Partial<Expense>
): Promise<IExpense | null> => {
	const res = await ExpenseModel.findOne(query).populate(
		"groupId paidBy createdBy"
	);
	return parsePopulatedExpense(res);
};

export const findById = async (id: string): Promise<IExpense | null> => {
	const res = await ExpenseModel.findById(id)
		.populate("groupId paidBy createdBy")
		.catch((error: any) => {
			if (error.kind === "ObjectId") return null;
			return Promise.reject(error);
		});
	return parsePopulatedExpense(res);
};

export const find = async (
	query: FilterQuery<Expense>
): Promise<IExpense | IExpense[] | null> => {
	const res = await ExpenseModel.find(query).populate(
		"groupId paidBy createdBy"
	);
	if (res.length > 1) {
		const parsedRes = res
			.map((obj) => parsePopulatedExpense(obj))
			.filter((obj) => obj !== null) as IExpense[];
		if (parsedRes.length > 0) return parsedRes;
	} else if (res.length === 1) {
		return parsePopulatedExpense(res[0]);
	}
	return null;
};

export const findAll = async (): Promise<Array<IExpense>> => {
	const res = await ExpenseModel.find({})
		.sort({ createdAt: -1 })
		.populate("groupId paidBy createdBy");
	const parsedRes = res
		.map((obj) => parsePopulatedExpense(obj))
		.filter((obj) => obj !== null) as IExpense[];
	if (parsedRes.length > 0) return parsedRes;
	return [];
};

export const create = async (
	body: Omit<Expense, "id" | "createdAt" | "updatedAt">
): Promise<IExpense> => {
	const res = await ExpenseModel.create(body);
	await res.populate("paidBy createdBy groupId");
	return getNonNullValue(parsePopulatedExpense(res));
};

export const update = async (
	query: Partial<Expense>,
	update: Partial<Omit<Expense, "id" | "createdAt" | "updatedAt">>
): Promise<IExpense | null> => {
	const res = query.id
		? await ExpenseModel.findByIdAndUpdate(query.id, update, {
				new: true,
			}).populate("paidBy createdBy groupId")
		: await ExpenseModel.findOneAndUpdate(query, update, {
				new: true,
			}).populate("paidBy createdBy groupId");
	return parsePopulatedExpense(res);
};

export const remove = async (
	query: Partial<Expense>
): Promise<IExpense | null> => {
	const res = query.id
		? await ExpenseModel.findByIdAndDelete(query.id).populate(
				"paidBy createdBy groupId"
			)
		: await ExpenseModel.findOneAndDelete(query).populate(
				"paidBy createdBy groupId"
			);
	return parsePopulatedExpense(res);
};

export const removeMultiple = async (
	query: Partial<Expense>
): Promise<number> => {
	const res = await ExpenseModel.deleteMany(query);
	return res.deletedCount;
};

export const getExpensesForUser = async (
	userId: string
): Promise<Array<IExpense>> => {
	const groups = await groupService.find({ members: { $in: [userId] } });
	const groupIds = Array.isArray(groups)
		? groups.map((group) => group.id)
		: groups
			? [groups.id]
			: [];
	const expenses = await expenseService.find({ groupId: { $in: groupIds } });
	if (!expenses) return [];
	if (!Array.isArray(expenses)) return [expenses];
	return expenses.filter((obj) => obj !== null) as IExpense[];
};
