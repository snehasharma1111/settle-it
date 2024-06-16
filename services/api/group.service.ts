import { Expense, ExpenseModel, Group, GroupModel, User } from "@/models";
import { expenseService, memberService } from "@/services/api";
import { IGroup } from "@/types/group";
import { getObjectFromMongoResponse } from "@/utils/parser";
import { getNonNullValue } from "@/utils/safety";
import { FilterQuery } from "mongoose";

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

export const getExpensesForGroup = async (groupId: string): Promise<any> => {
	const res = await ExpenseModel.find({ groupId }).populate(
		"paidBy createdBy"
	);
	return res.map((obj) => getObjectFromMongoResponse<Expense>(obj));
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
