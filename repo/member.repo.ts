import { BaseRepo } from "./base";
import { Expense, Member } from "@/schema";
import {
	CreateModel,
	IExpense,
	IGroup,
	IMember,
	ITransaction,
	IUser,
	ObjectId,
	Share,
	Transaction,
} from "@/types";
import { MemberModel } from "@/models";
import {
	getNonNullValue,
	getNumber,
	getObjectFromMongoResponse,
	omitKeys,
} from "@/utils";
import { FilterQuery, UpdateQuery } from "mongoose";
import { expenseRepo } from "@/repo/expense.repo";

export class MemberRepo extends BaseRepo<Member, IMember> {
	protected model = MemberModel;
	public parser(member: Member | null): IMember | null {
		if (!member) return null;
		const parsed = getObjectFromMongoResponse<Member>(member);
		if (!parsed) return null;
		let originalExpense: string | Expense = parsed.expenseId,
			finalExpense: IExpense;
		if (typeof originalExpense !== "string") {
			originalExpense = parsed.expenseId as unknown as Expense;
			const parsedExpense = expenseRepo.parser(originalExpense);
			finalExpense = parsedExpense as IExpense;
		} else {
			throw new Error("Invalid expenseId");
		}
		return {
			...omitKeys(parsed, ["userId", "groupId", "expenseId"]),
			user: getObjectFromMongoResponse<IUser>(parsed.userId),
			group: getObjectFromMongoResponse<IGroup>(parsed.groupId),
			expense: finalExpense,
		};
	}

	public async findOne(query: Partial<Member>): Promise<IMember | null> {
		const res = await this.model
			.findOne<Member>(query)
			.populate("userId groupId expenseId")
			.populate({
				path: "expenseId",
				model: "Expense",
				populate: {
					path: "paidBy",
					model: "User",
				},
			})
			.populate({
				path: "expenseId",
				model: "Expense",
				populate: {
					path: "createdBy",
					model: "User",
				},
			})
			.populate({
				path: "expenseId",
				model: "Expense",
				populate: {
					path: "groupId",
					model: "Group",
				},
			});
		return this.parser(res);
	}

	public async findById(id: string): Promise<IMember | null> {
		const res = await this.model
			.findById<Member>(id)
			.populate("userId groupId expenseId")
			.populate({
				path: "expenseId",
				model: "Expense",
				populate: {
					path: "paidBy",
					model: "User",
				},
			})
			.populate({
				path: "expenseId",
				model: "Expense",
				populate: {
					path: "createdBy",
					model: "User",
				},
			})
			.populate({
				path: "expenseId",
				model: "Expense",
				populate: {
					path: "groupId",
					model: "Group",
				},
			})
			.catch((error: any) => {
				if (error.kind === "ObjectId") return null;
				throw error;
			});
		return this.parser(res);
	}

	public async find(
		query: FilterQuery<Member>
	): Promise<Array<IMember> | null> {
		const res = await this.model
			.find<Member>(query)
			.populate("userId groupId expenseId")
			.populate({
				path: "expenseId",
				model: "Expense",
				populate: {
					path: "paidBy",
					model: "User",
				},
			})
			.populate({
				path: "expenseId",
				model: "Expense",
				populate: {
					path: "createdBy",
					model: "User",
				},
			})
			.populate({
				path: "expenseId",
				model: "Expense",
				populate: {
					path: "groupId",
					model: "Group",
				},
			});
		const parsedRes = res.map(this.parser).filter((obj) => obj !== null);
		if (parsedRes.length > 0) return parsedRes;
		return null;
	}

	public async findAll(): Promise<Array<IMember>> {
		const res = await this.model
			.find<Member>({})
			.sort({ createdAt: -1 })
			.populate("userId groupId expenseId")
			.populate({
				path: "expenseId",
				model: "Expense",
				populate: {
					path: "paidBy",
					model: "User",
				},
			})
			.populate({
				path: "expenseId",
				model: "Expense",
				populate: {
					path: "createdBy",
					model: "User",
				},
			})
			.populate({
				path: "expenseId",
				model: "Expense",
				populate: {
					path: "groupId",
					model: "Group",
				},
			});
		const parsedRes = res.map(this.parser).filter((obj) => obj !== null);
		if (parsedRes.length > 0) return parsedRes;
		return [];
	}

	public async create(body: CreateModel<Member>): Promise<IMember> {
		const res = await this.model.create<CreateModel<Member>>(body);
		await res.populate("userId groupId expenseId");
		return getNonNullValue(this.parser(res));
	}

	public async update(
		query: FilterQuery<Member>,
		update: UpdateQuery<Member>
	): Promise<IMember | null> {
		const filter = query.id ? { _id: query.id } : query;
		const res = await this.model
			.findOneAndUpdate<Member>(filter, update, { new: true })
			.populate("userId groupId expenseId")
			.populate({
				path: "expenseId",
				model: "Expense",
				populate: {
					path: "paidBy",
					model: "User",
				},
			})
			.populate({
				path: "expenseId",
				model: "Expense",
				populate: {
					path: "createdBy",
					model: "User",
				},
			})
			.populate({
				path: "expenseId",
				model: "Expense",
				populate: {
					path: "groupId",
					model: "Group",
				},
			});
		return this.parser(res);
	}

	public async remove(query: Partial<Member>): Promise<IMember | null> {
		const filter = query.id ? { _id: query.id } : query;
		const res = await this.model
			.findOneAndDelete<Member>(filter)
			.populate("userId groupId expenseId")
			.populate({
				path: "expenseId",
				model: "Expense",
				populate: {
					path: "paidBy",
					model: "User",
				},
			})
			.populate({
				path: "expenseId",
				model: "Expense",
				populate: {
					path: "createdBy",
					model: "User",
				},
			})
			.populate({
				path: "expenseId",
				model: "Expense",
				populate: {
					path: "groupId",
					model: "Group",
				},
			});
		return this.parser(res);
	}

	public async bulkCreate(
		body: Array<CreateModel<Member>>
	): Promise<Array<IMember>> {
		const res = await this.model.insertMany<CreateModel<Member>>(body);
		res.map(async (obj) => await obj.populate("userId groupId expenseId"));
		return res.map(this.parser).filter((obj) => obj !== null);
	}

	public async bulkUpdate(
		body: Array<FilterQuery<Member> & UpdateQuery<Member>>
	): Promise<any> {
		return await this.model.bulkWrite<Member>(
			body.map((obj) => ({
				updateOne: {
					filter: obj.filter,
					update: obj.update,
				},
			}))
		);
	}

	public async bulkRemove(query: FilterQuery<Member>): Promise<number> {
		const res = await this.model.deleteMany(query);
		return res.deletedCount;
	}

	public async settleOne(query: Partial<Member>): Promise<IMember | null> {
		const updateRequest = [
			{
				$set: {
					paid: { $add: ["$paid", "$owed"] },
					owed: 0,
				},
			},
		];
		return this.update(query, updateRequest);
	}

	public async settleMany(query: FilterQuery<Member>): Promise<number> {
		const members = await this.find(query);
		if (!members || members.length === 0) return 0;
		const res = await this.model.bulkWrite(
			members.map((member) => ({
				updateOne: {
					filter: { _id: member.id },
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
	}
	/**
	 * Builds a compact pairwise transaction summary for a group.
	 *
	 * Purpose:
	 * - For each (member -> expense.paidBy) pair, aggregate how much the member still owes and has already paid.
	 * - Output is a list of directed edges suitable for higher-level balance computations.
	 *
	 * Process (MongoDB aggregation pipeline):
	 * 1) $match: limit members by groupId.
	 * 2) $lookup expenses by each member's expenseId.
	 * 3) $unwind: flatten the joined expense array to a single document per member-expense.
	 * 4) $group by { userId, expense.paidBy } and sum owed/paid.
	 *
	 * Post-processing:
	 * - map to { from, to, stillOwes, hasPaid }
	 * - filter out self-edges (from === to)
	 * - filter out edges where both stillOwes and hasPaid are zero
	 * - map to Transaction shape { from, to, owed, paid }
	 *
	 * Input:
	 * - groupId: string (Mongo ObjectId as string)
	 *
	 * Output:
	 * - Array<Transaction> where `from` and `to` are userId strings, and `owed`/`paid` are totals.
	 */
	public async getAllTransactionsSummaryForGroup(
		groupId: string
	): Promise<Array<Transaction>> {
		const result = await this.model.aggregate([
			// get members involved in this group
			{
				$match: {
					groupId: new ObjectId(groupId),
				},
			},
			// populate expenses in every member
			{
				$lookup: {
					from: "expenses",
					localField: "expenseId",
					foreignField: "_id",
					as: "expense",
				},
			},
			// only get first expense from the array
			{
				$unwind: "$expense",
			},
			// group by member.userId and member.expense.paidBy
			{
				$group: {
					_id: {
						userId: "$userId",
						expensePaidBy: "$expense.paidBy",
					},
					totalOwed: { $sum: "$owed" },
					totalPaid: { $sum: "$paid" },
				},
			},
		]);
		// build the summary array of 'from-to-stillOwes-hasPaid'

		return result
			.map((a) => ({
				from: a._id.userId.toString(),
				to: a._id.expensePaidBy.toString(),
				stillOwes: a.totalOwed,
				hasPaid: a.totalPaid,
			}))
			.filter((a) => a.from !== a.to)
			.filter((a) => a.stillOwes > 0 || a.hasPaid > 0)
			.map((a) => ({
				from: a.from,
				to: a.to,
				owed: a.stillOwes,
				paid: a.hasPaid,
			}));
	}
	/**
	 * Returns the full denormalized transaction list for a group with populated users.
	 *
	 * Purpose:
	 * - Provide detailed audit-friendly records: title, from (user), to (paidBy), owed, paid.
	 * - Unlike the summary endpoint, this keeps user objects populated for rich display.
	 *
	 * Process (MongoDB aggregation pipeline):
	 * 1) $match group members by groupId.
	 * 2) $lookup the expense for each member.
	 * 3) $unwind expense.
	 * 4) $lookup the `user` (member.userId) and unwind.
	 * 5) $lookup the `expense.paidBy` and unwind.
	 * 6) $project desired fields and strip _id.
	 *
	 * Post-processing:
	 * - Convert raw user docs to IUser using getObjectFromMongoResponse.
	 * - Cast owed/paid to numbers and drop self-edges (from.id !== to.id).
	 *
	 * Input:
	 * - groupId: string
	 *
	 * Output:
	 * - Array<ITransaction> where `from` and `to` are IUser objects.
	 */
	public async getAllTransactionsForGroup(
		groupId: string
	): Promise<Array<ITransaction>> {
		const result = await this.model.aggregate([
			// get members involved in this group
			{
				$match: {
					groupId: new ObjectId(groupId),
				},
			},
			// populate expenses in every member
			{
				$lookup: {
					from: "expenses",
					localField: "expenseId",
					foreignField: "_id",
					as: "expense",
				},
			},
			// only get first expense from the array
			{
				$unwind: "$expense",
			},
			// populate user
			{
				$lookup: {
					from: "users",
					localField: "userId",
					foreignField: "_id",
					as: "user",
				},
			},
			// only get first user from the array
			{
				$unwind: "$user",
			},
			// populate expense.paidBy
			{
				$lookup: {
					from: "users",
					localField: "expense.paidBy",
					foreignField: "_id",
					as: "expense.paidBy",
				},
			},
			// only get first user from the array
			{
				$unwind: "$expense.paidBy",
			},
			{
				$project: {
					_id: 0,
					title: "$expense.title",
					from: "$user",
					to: "$expense.paidBy",
					owed: "$owed",
					paid: "$paid",
				},
			},
		]);
		return result
			.map((obj: any) => ({
				...obj,
				from: getObjectFromMongoResponse<IUser>(obj.from),
				to: getObjectFromMongoResponse<IUser>(obj.to),
				owed: getNumber(obj.owed),
				paid: getNumber(obj.paid),
			}))
			.filter((obj) => obj.from.id !== obj.to.id);
	}
	/**
	 * Aggregates each member's total share (amount) within a group.
	 *
	 * Purpose:
	 * - Compute per-user contribution totals for use in share charts and summaries.
	 *
	 * Process (MongoDB aggregation pipeline):
	 * 1) $match by groupId.
	 * 2) $group by userId and sum `amount`.
	 * 3) $project to { user, amount } with stringified user id.
	 *
	 * Input:
	 * - groupId: string
	 *
	 * Output:
	 * - Array<Share> where each item is { user: string, amount: number }.
	 */
	public async getSharesForGroup(groupId: string): Promise<Array<Share>> {
		const result = await this.model.aggregate([
			// get members involved in this group
			{
				$match: {
					groupId: new ObjectId(groupId),
				},
			},
			// group member by user id
			{
				$group: {
					_id: "$userId",
					amount: { $sum: "$amount" },
				},
			},
			{
				$project: {
					_id: 0,
					user: "$_id",
					amount: 1,
				},
			},
		]);
		return result.map((res) => ({
			user: res.user.toString(),
			amount: res.amount,
		}));
	}
}

export const memberRepo = MemberRepo.getInstance<MemberRepo>();
