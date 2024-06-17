import { Member, MemberModel } from "@/models";
import { IExpense } from "@/types/expense";
import { IGroup } from "@/types/group";
import { IMember } from "@/types/member";
import { IUser } from "@/types/user";
import { getObjectFromMongoResponse } from "@/utils/parser";
import { getNonNullValue } from "@/utils/safety";
import { FilterQuery, UpdateQuery } from "mongoose";

export const parsePopulatedMember = (member: Member): IMember | null => {
	if (!member) return null;
	const res = getObjectFromMongoResponse<Member>(member);
	if (!res) return null;
	return {
		...res,
		user: getObjectFromMongoResponse<IUser>(res.userId) as IUser,
		group: getObjectFromMongoResponse<IGroup>(res.groupId) as IGroup,
		expense: getObjectFromMongoResponse<IExpense>(
			res.expenseId
		) as IExpense,
	};
};

export const findOne = async (
	query: Partial<Member>
): Promise<IMember | null> => {
	const res = await MemberModel.findOne(query).populate(
		"userId groupId expenseId"
	);
	return parsePopulatedMember(res);
};

export const findById = async (id: string): Promise<IMember | null> => {
	const res = await MemberModel.findById(id)
		.populate("userId groupId expenseId")
		.catch((error: any) => {
			if (error.kind === "ObjectId") return null;
			return Promise.reject(error);
		});
	return parsePopulatedMember(res);
};

export const find = async (
	query: Partial<Member>
): Promise<IMember | Array<IMember> | null> => {
	const res = await MemberModel.find(query);
	if (res.length > 1) {
		const parsedRes = res
			.map((obj) => parsePopulatedMember(obj))
			.filter((obj) => obj !== null) as IMember[];
		if (parsedRes.length > 0) return parsedRes;
	} else if (res.length === 1) {
		return parsePopulatedMember(res[0]);
	}
	return null;
};

export const findAll = async (): Promise<Array<IMember>> => {
	const res = await MemberModel.find({})
		.sort({ createdAt: -1 })
		.populate("userId groupId expenseId");
	const parsedRes = res
		.map((obj) => parsePopulatedMember(obj))
		.filter((obj) => obj !== null) as IMember[];
	if (parsedRes.length > 0) return parsedRes;
	return [];
};

export const create = async (
	body: Omit<Member, "id" | "createdAt" | "updatedAt">
): Promise<IMember> => {
	const res = await MemberModel.create(body);
	await res.populate("userId groupId expenseId");
	return getNonNullValue(parsePopulatedMember(res));
};

export const update = async (
	query: Partial<Member>,
	update: Partial<Omit<Member, "id" | "createdAt" | "updatedAt">>
): Promise<IMember | null> => {
	const res = query.id
		? await MemberModel.findByIdAndUpdate(query.id, update, {
				new: true,
			}).populate("userId groupId expenseId")
		: await MemberModel.findOneAndUpdate(query, update, {
				new: true,
			}).populate("userId groupId expenseId");
	return parsePopulatedMember(res);
};

export const settleOne = async (
	query: Partial<Member>
): Promise<IMember | null> => {
	const res = await MemberModel.findOneAndUpdate(query, {
		$set: {
			owed: 0,
			paid: "$owed",
		},
	}).populate("userId groupId expenseId");
	return parsePopulatedMember(res);
};

export const settleMany = async (query: Partial<Member>): Promise<number> => {
	const members = await MemberModel.find(query);
	if (members.length === 0) return 0;
	const res = await MemberModel.bulkWrite(
		members.map((member) => ({
			updateOne: {
				filter: { id: member.id },
				update: {
					$set: {
						owed: 0,
						paid: member.amount,
					},
				},
			},
		}))
	);
	return res.modifiedCount;
};

export const remove = async (
	query: Partial<Member>
): Promise<IMember | null> => {
	const res = query.id
		? await MemberModel.findByIdAndDelete(query.id).populate(
				"userId groupId expenseId"
			)
		: await MemberModel.findOneAndDelete(query).populate(
				"userId groupId expenseId"
			);
	return parsePopulatedMember(res);
};

export const bulkCreate = async (
	body: Array<Omit<Member, "id" | "createdAt" | "updatedAt">>
): Promise<Array<IMember>> => {
	const res = await MemberModel.insertMany(body);
	res.map(async (obj) => await obj.populate("userId groupId expenseId"));
	return res
		.map((obj) => parsePopulatedMember(obj))
		.filter((obj) => obj !== null) as IMember[];
};

export const bulkUpdate = async (
	query: FilterQuery<Member>,
	update: UpdateQuery<Omit<Member, "id" | "createdAt" | "updatedAt">>
): Promise<number> => {
	const res = await MemberModel.updateMany(query, update);
	return res.modifiedCount;
};

export const bulkRemove = async (
	query: FilterQuery<Member>
): Promise<number> => {
	const res = await MemberModel.deleteMany(query);
	return res.deletedCount;
};
