import { Expense, ExpenseModel } from "@/models";
import { getObjectFromMongoResponse } from "@/utils/parser";
import { getNonNullValue } from "@/utils/safety";

export const findOne = async (
	query: Partial<Expense>
): Promise<Expense | null> => {
	const res = await ExpenseModel.findOne(query);
	return getObjectFromMongoResponse<Expense>(res);
};

export const findById = async (id: string): Promise<Expense | null> => {
	const res = await ExpenseModel.findById(id)

		.catch((error: any) => {
			if (error.kind === "ObjectId") return null;
			return Promise.reject(error);
		});
	return getObjectFromMongoResponse<Expense>(res);
};

export const find = async (
	query: Partial<Expense>
): Promise<Expense | Expense[] | null> => {
	const res = await ExpenseModel.find(query);
	if (res.length > 1) {
		const parsedRes = res
			.map((obj) => getObjectFromMongoResponse<Expense>(obj))
			.filter((obj) => obj !== null) as Expense[];
		if (parsedRes.length > 0) return parsedRes;
	} else if (res.length === 1) {
		return getObjectFromMongoResponse<Expense>(res[0]);
	}
	return null;
};

export const findAll = async (): Promise<Array<Expense>> => {
	const res = await ExpenseModel.find({}).sort({ createdAt: -1 });
	const parsedRes = res
		.map((obj) => getObjectFromMongoResponse<Expense>(obj))
		.filter((obj) => obj !== null) as Expense[];
	if (parsedRes.length > 0) return parsedRes;
	return [];
};

export const create = async (
	body: Omit<Expense, "id" | "createdAt" | "updatedAt">
): Promise<Expense> => {
	const res = await ExpenseModel.create(body);
	return getNonNullValue(getObjectFromMongoResponse<Expense>(res));
};

export const update = async (
	query: Partial<Expense>,
	update: Partial<Omit<Expense, "id" | "createdAt" | "updatedAt">>
): Promise<Expense | null> => {
	const res = query.id
		? await ExpenseModel.findByIdAndUpdate(query.id, update, {
				new: true,
			})
		: await ExpenseModel.findOneAndUpdate(query, update, {
				new: true,
			}).select("-password");
	return getObjectFromMongoResponse<Expense>(res);
};

export const remove = async (
	query: Partial<Expense>
): Promise<Expense | null> => {
	const res = query.id
		? await ExpenseModel.findByIdAndDelete(query.id)
		: await ExpenseModel.findOneAndDelete(query);
	return getObjectFromMongoResponse<Expense>(res);
};
