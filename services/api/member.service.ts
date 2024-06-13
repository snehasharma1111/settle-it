import { Member, MemberModel } from "@/models";
import { getObjectFromMongoResponse } from "@/utils/parser";
import { getNonNullValue } from "@/utils/safety";

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
): Promise<Member | Member[] | null> => {
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
			}).select("-password");
	return getObjectFromMongoResponse<Member>(res);
};

export const remove = async (
	query: Partial<Member>
): Promise<Member | null> => {
	const res = query.id
		? await MemberModel.findByIdAndDelete(query.id)
		: await MemberModel.findOneAndDelete(query);
	return getObjectFromMongoResponse<Member>(res);
};
