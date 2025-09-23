import { EXPENSE_STATUS, HTTP } from "@/constants";
import { ExpenseService } from "@/services";
import { ApiSuccess } from "@/server";
import {
	ApiRequest,
	ApiRequests,
	ApiResponse,
	ApiResponses,
	T_EXPENSE_STATUS,
} from "@/types";
import {
	genericParse,
	getArray,
	getNonEmptyString,
	getNonNegativeNumber,
	getSearchParam,
	safeParse,
} from "@/utils";

export class ExpenseController {
	public static async getUsersExpenses(req: ApiRequest, res: ApiResponse) {
		const loggedInUserId = genericParse(getNonEmptyString, req.user?.id);
		const expenses =
			await ExpenseService.getExpensesForUser(loggedInUserId);
		return new ApiSuccess<ApiResponses.GetUsersExpenses>(res).send(
			expenses
		);
	}
	public static async createExpense(
		req: ApiRequest<ApiRequests.CreateExpense>,
		res: ApiResponse
	) {
		const loggedInUserId = genericParse(getNonEmptyString, req.user?.id);
		const title = genericParse(getNonEmptyString, req.body.title);
		const amount = genericParse(getNonNegativeNumber, req.body.amount);
		const groupId = genericParse(getNonEmptyString, req.group?.id);
		const paidBy =
			safeParse(getNonEmptyString, req.body.paidBy) || loggedInUserId;
		const paidOn =
			safeParse(getNonEmptyString, req.body.paidOn) ||
			new Date().toISOString();
		const description =
			safeParse(getNonEmptyString, req.body.description) || "";
		const members = genericParse(
			getArray<{ userId: string; amount: number }>,
			req.body.members
		);
		const createdExpense = await ExpenseService.createExpense({
			body: { title, amount, groupId, paidBy, paidOn, description },
			loggedInUserId,
			members,
		});
		return new ApiSuccess<ApiResponses.CreateExpense>(res)
			.status(HTTP.status.CREATED)
			.send(createdExpense);
	}
	public static async updateExpense(
		req: ApiRequest<ApiRequests.UpdateExpense>,
		res: ApiResponse
	) {
		const loggedInUserId = genericParse(getNonEmptyString, req.user?.id);
		const expenseId = genericParse(
			getNonEmptyString,
			getSearchParam(req.url, "expenseId")
		);
		const title = safeParse(getNonEmptyString, req.body.title);
		const amount = safeParse(getNonNegativeNumber, req.body.amount);
		const paidBy = safeParse(getNonEmptyString, req.body.paidBy);
		const paidOn = safeParse(getNonEmptyString, req.body.paidOn);
		const description = safeParse(getNonEmptyString, req.body.description);
		const status = safeParse(
			(s: T_EXPENSE_STATUS) => EXPENSE_STATUS[s],
			req.body.status
		);
		const members = safeParse(
			getArray<{ userId: string; amount: number }>,
			req.body.members
		);
		const updatedExpense = await ExpenseService.updateExpense({
			id: expenseId,
			loggedInUserId,
			title,
			amount,
			paidBy,
			paidOn,
			description,
			status,
			members,
		});
		return new ApiSuccess<ApiResponses.UpdateExpense>(res).send(
			updatedExpense
		);
	}
	public static async removeExpense(
		req: ApiRequest<ApiRequests.RemoveExpense>,
		res: ApiResponse
	) {
		const loggedInUserId = genericParse(getNonEmptyString, req.user?.id);
		const expenseId = genericParse(
			getNonEmptyString,
			getSearchParam(req.url, "expenseId")
		);
		const removedExpense = await ExpenseService.removeExpense({
			expenseId,
			loggedInUserId,
		});
		return new ApiSuccess<ApiResponses.RemoveExpense>(res).send(
			removedExpense!
		);
	}
	public static async settleExpense(
		req: ApiRequest<ApiRequests.SettleExpense>,
		res: ApiResponse
	) {
		const loggedInUserId = genericParse(getNonEmptyString, req.user?.id);
		const expenseId = genericParse(
			getNonEmptyString,
			getSearchParam(req.url, "expenseId")
		);
		const updatedMembersInfo = await ExpenseService.settleExpense({
			expenseId,
			loggedInUserId,
		});
		return new ApiSuccess<ApiResponses.SettleExpense>(res).send(
			updatedMembersInfo
		);
	}
	public static async memberPaidAmount(
		req: ApiRequest<ApiRequests.MemberPaidAmount>,
		res: ApiResponse
	) {
		const loggedInUserId = genericParse(getNonEmptyString, req.user?.id);
		const memberId = genericParse(
			getNonEmptyString,
			getSearchParam(req.url, "memberId")
		);
		const paidAmount = genericParse(
			getNonNegativeNumber,
			req.body.paidAmount
		);
		const updatedMembersInfo = await ExpenseService.memberPaidForExpense({
			memberId,
			loggedInUserId,
			paidAmount,
		});
		return new ApiSuccess<ApiResponses.MemberPaidAmount>(res).send(
			updatedMembersInfo
		);
	}
}
