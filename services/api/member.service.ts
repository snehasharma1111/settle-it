import { Member, MemberModel } from "@/models";
import { getObjectFromMongoResponse } from "@/utils/parser";
import { getNonNullValue } from "@/utils/safety";
import { FilterQuery, UpdateQuery } from "mongoose";

export const findOne = async (
	query: Partial<Member>
): Promise<Member | null> => {
	const res = await MemberModel.findOne(query);
	return getObjectFromMongoResponse<Member>(res);
};

export const findById = async (id: string): Promise<Member | null> => {
	const res = await MemberModel.findById(id)

		.catch((error: any) => {
			if (error.kind === "ObjectId") return null;
			return Promise.reject(error);
		});
	return getObjectFromMongoResponse<Member>(res);
};

export const find = async (
	query: Partial<Member>
): Promise<Member | Array<Member> | null> => {
	const res = await MemberModel.find(query);
	if (res.length > 1) {
		const parsedRes = res
			.map((obj) => getObjectFromMongoResponse<Member>(obj))
			.filter((obj) => obj !== null) as Member[];
		if (parsedRes.length > 0) return parsedRes;
	} else if (res.length === 1) {
		return getObjectFromMongoResponse<Member>(res[0]);
	}
	return null;
};

export const findAll = async (): Promise<Array<Member>> => {
	const res = await MemberModel.find({}).sort({ createdAt: -1 });
	const parsedRes = res
		.map((obj) => getObjectFromMongoResponse<Member>(obj))
		.filter((obj) => obj !== null) as Member[];
	if (parsedRes.length > 0) return parsedRes;
	return [];
};

export const create = async (
	body: Omit<Member, "id" | "createdAt" | "updatedAt">
): Promise<Member> => {
	const res = await MemberModel.create(body);
	return getNonNullValue(getObjectFromMongoResponse<Member>(res));
};

export const update = async (
	query: Partial<Member>,
	update: Partial<Omit<Member, "id" | "createdAt" | "updatedAt">>
): Promise<Member | null> => {
	const res = query.id
		? await MemberModel.findByIdAndUpdate(query.id, update, {
				new: true,
			})
		: await MemberModel.findOneAndUpdate(query, update, {
				new: true,
			});
	return getObjectFromMongoResponse<Member>(res);
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
): Promise<Member | null> => {
	const res = query.id
		? await MemberModel.findByIdAndDelete(query.id)
		: await MemberModel.findOneAndDelete(query);
	return getObjectFromMongoResponse<Member>(res);
};

export const bulkCreate = async (
	body: Array<Omit<Member, "id" | "createdAt" | "updatedAt">>
): Promise<Array<Member>> => {
	const res = await MemberModel.insertMany(body);
	return res
		.map((obj) => getObjectFromMongoResponse<Member>(obj))
		.filter((obj) => obj !== null) as Member[];
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
