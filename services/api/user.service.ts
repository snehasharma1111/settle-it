import { User, UserModel } from "@/models";
import { getObjectFromMongoResponse } from "@/utils/parser";
import { getNonNullValue } from "@/utils/safety";

export const findOne = async (query: Partial<User>): Promise<User | null> => {
	const res = await UserModel.findOne(query);
	return getObjectFromMongoResponse<User>(res);
};

export const findById = async (id: string): Promise<User | null> => {
	const res = await UserModel.findById(id).catch((error: any) => {
		if (error.kind === "ObjectId") return null;
		return Promise.reject(error);
	});
	return getObjectFromMongoResponse<User>(res);
};

export const find = async (
	query: Partial<User>
): Promise<User | User[] | null> => {
	const res = await UserModel.find(query);
	if (res.length > 1) {
		const parsedRes = res
			.map((user) => getObjectFromMongoResponse<User>(user))
			.filter((user) => user !== null) as User[];
		if (parsedRes.length > 0) return parsedRes;
	} else if (res.length === 1) {
		return getObjectFromMongoResponse<User>(res[0]);
	}
	return null;
};

export const findAll = async (): Promise<Array<User>> => {
	const res = await UserModel.find({}).sort({ createdAt: -1 });
	const parsedRes = res
		.map((user) => getObjectFromMongoResponse<User>(user))
		.filter((user) => user !== null) as User[];
	if (parsedRes.length > 0) return parsedRes;
	return [];
};

export const create = async (
	user: Omit<User, "id" | "createdAt" | "updatedAt">
): Promise<User> => {
	const res = await UserModel.create(user);
	return getNonNullValue(getObjectFromMongoResponse<User>(res));
};

export const update = async (
	query: Partial<User>,
	update: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
): Promise<User | null> => {
	const res = query.id
		? await UserModel.findByIdAndUpdate(query.id, update, {
				new: true,
			})
		: await UserModel.findOneAndUpdate(query, update, { new: true });
	return getObjectFromMongoResponse<User>(res);
};

export const remove = async (query: Partial<User>): Promise<User | null> => {
	const res = query.id
		? await UserModel.findByIdAndDelete(query.id)
		: await UserModel.findOneAndDelete(query);
	return getObjectFromMongoResponse<User>(res);
};
