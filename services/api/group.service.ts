import { Group, GroupModel } from "@/models";
import { getObjectFromMongoResponse } from "@/utils/parser";
import { getNonNullValue } from "@/utils/safety";
import { expenseService, memberService } from "@/services/api";

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
	query: Partial<Group>
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
	await memberService.removeMultiple({
		groupId: id,
	});
	await expenseService.removeMultiple({
		groupId: id,
	});
	return true;
};
