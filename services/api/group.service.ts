import { Group, GroupModel } from "@/models";
import { expenseService, memberService } from "@/services/api";
import { getObjectFromMongoResponse } from "@/utils/parser";
import { getNonNullValue } from "@/utils/safety";
import { FilterQuery } from "mongoose";

export const findOne = async (query: Partial<Group>): Promise<Group | null> => {
	const res = await GroupModel.findOne(query);
	return getObjectFromMongoResponse<Group>(res);
};

export const findById = async (id: string): Promise<Group | null> => {
	const res = await GroupModel.findById(id)

		.catch((error: any) => {
			if (error.kind === "ObjectId") return null;
			return Promise.reject(error);
		});
	return getObjectFromMongoResponse<Group>(res);
};

export const find = async (
	query: FilterQuery<Group>
): Promise<Group | Group[] | null> => {
	const res = await GroupModel.find(query);
	if (res.length > 1) {
		const parsedRes = res
			.map((obj) => getObjectFromMongoResponse<Group>(obj))
			.filter((obj) => obj !== null) as Group[];
		if (parsedRes.length > 0) return parsedRes;
	} else if (res.length === 1) {
		return getObjectFromMongoResponse<Group>(res[0]);
	}
	return null;
};

export const findAll = async (): Promise<Array<Group>> => {
	const res = await GroupModel.find({}).sort({ createdAt: -1 });
	const parsedRes = res
		.map((obj) => getObjectFromMongoResponse<Group>(obj))
		.filter((obj) => obj !== null) as Group[];
	if (parsedRes.length > 0) return parsedRes;
	return [];
};

export const getGroupsUserIsPartOf = async (userId: string): Promise<any> => {
	// also count number of expenses in every group
	const result = await GroupModel.aggregate([
		{
			$match: {
				members: { $in: [userId] },
			},
		},
		{
			$lookup: {
				from: "members",
				localField: "id",
				foreignField: "groupId",
				as: "members",
			},
		},
		{
			$unwind: "$members",
		},
		{
			$match: {
				"members.userId": userId,
			},
		},
		{
			$group: {
				_id: "$id",
				name: { $first: "$name" },
				icon: { $first: "$icon" },
				banner: { $first: "$banner" },
				type: { $first: "$type" },
				totalOwed: { $sum: "$members.owed" },
				totalPaid: { $sum: "$members.paid" },
			},
		},
		{
			$project: {
				_id: 0,
				id: "$_id",
				name: 1,
				icon: 1,
				banner: 1,
				type: 1,
				totalOwed: 1,
				totalPaid: 1,
				netBalance: { $subtract: ["$totalPaid", "$totalOwed"] },
			},
		},
	]);
	return result;
};

export const create = async (
	body: Omit<Group, "id" | "createdAt" | "updatedAt">
): Promise<Group> => {
	const res = await GroupModel.create(body);
	return getNonNullValue(getObjectFromMongoResponse<Group>(res));
};

export const update = async (
	query: Partial<Group>,
	update: Partial<Omit<Group, "id" | "createdAt" | "updatedAt">>
): Promise<Group | null> => {
	const res = query.id
		? await GroupModel.findByIdAndUpdate(query.id, update, {
				new: true,
			})
		: await GroupModel.findOneAndUpdate(query, update, {
				new: true,
			});
	return getObjectFromMongoResponse<Group>(res);
};

export const remove = async (query: Partial<Group>): Promise<Group | null> => {
	const res = query.id
		? await GroupModel.findByIdAndDelete(query.id)
		: await GroupModel.findOneAndDelete(query);
	return getObjectFromMongoResponse<Group>(res);
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
): Promise<Group | null> => {
	const updatedGroup = await GroupModel.findByIdAndUpdate(groupId, {
		$push: { members: { $each: newMembers } },
	});
	return getObjectFromMongoResponse<Group>(updatedGroup);
};

export const removeMembers = async (
	groupId: string,
	members: Array<string>
): Promise<Group | null> => {
	const updatedGroup = await GroupModel.findByIdAndUpdate(groupId, {
		$pull: { members: { $in: members } },
	});
	return getObjectFromMongoResponse<Group>(updatedGroup);
};
