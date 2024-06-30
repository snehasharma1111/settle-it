import { User, UserModel } from "@/models";
import { IUser } from "@/types/user";
import { getObjectFromMongoResponse } from "@/utils/parser";
import { getNonNullValue } from "@/utils/safety";
import { FilterQuery } from "mongoose";
import { sendEmailTemplate } from "../email.service";

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
	query: FilterQuery<User>
): Promise<User[] | null> => {
	const res = await UserModel.find(query);
	const parsedRes = res
		.map((user) => getObjectFromMongoResponse<User>(user))
		.filter((user) => user !== null) as User[];
	if (parsedRes.length > 0) return parsedRes;
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

export const invite = async (
	email: string,
	invitedBy: string
): Promise<void> => {
	try {
		const invitedByUser = await UserModel.findById(invitedBy);
		await sendEmailTemplate(email, "Invite to Settle It", "USER_INVITED", {
			invitedBy: {
				email: invitedByUser?.email,
				name: invitedByUser?.name,
			},
		});
	} catch (error) {
		console.error(error);
	}
};

export const searchByEmail = async (
	emailQuery: string
): Promise<Array<User> | null> => {
	const query = emailQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const res = await UserModel.find({
		email: { $regex: query, $options: "i" },
	});
	const parsedRes = res
		.map((user) => getObjectFromMongoResponse<User>(user))
		.filter((user) => user !== null) as User[];
	if (parsedRes.length > 0) return parsedRes;
	return null;
};

export const getUsersMapForUserIds = async (
	userIds: string[]
): Promise<Map<string, IUser>> => {
	const res = await UserModel.find({ _id: { $in: userIds } });
	const parsedRes = res
		.map(getObjectFromMongoResponse<IUser>)
		.filter((user) => user !== null)
		.map(getNonNullValue);
	const usersMap = new Map<string, IUser>(
		parsedRes.map((user) => [user.id, user])
	);

	return usersMap;
};
