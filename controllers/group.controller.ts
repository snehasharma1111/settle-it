import { HTTP } from "@/constants";
import { GroupService } from "@/services";
import { Group } from "@/schema";
import { ApiFailure, ApiSuccess } from "@/server";
import { ApiRequest, ApiRequests, ApiResponse, ApiResponses } from "@/types";
import { genericParse, getArray, getNonEmptyString, safeParse } from "@/utils";

export class GroupController {
	public static async getGroupsForUser(req: ApiRequest, res: ApiResponse) {
		const loggedInUserId = genericParse(getNonEmptyString, req.user?.id);
		const groups = await GroupService.getGroupsUserIsPartOf(loggedInUserId);
		return new ApiSuccess<ApiResponses.GetGroupsForUser>(res).send(groups);
	}
	public static async getGroupDetails(req: ApiRequest, res: ApiResponse) {
		const group = req.group;
		return new ApiSuccess<ApiResponses.GetGroupDetails>(res).send(group);
	}
	public static async getGroupExpenses(req: ApiRequest, res: ApiResponse) {
		const groupId = genericParse(getNonEmptyString, req.group?.id);
		const expenses = await GroupService.getGroupExpenses(groupId);
		return new ApiSuccess<ApiResponses.GetGroupExpenses>(res).send(
			expenses
		);
	}
	public static async createGroup(
		req: ApiRequest<ApiRequests.CreateGroup>,
		res: ApiResponse
	) {
		const name = genericParse(getNonEmptyString, req.body.name);
		const icon = safeParse(getNonEmptyString, req.body.icon) || "";
		const banner = safeParse(getNonEmptyString, req.body.banner) || "";
		const type = safeParse(getNonEmptyString, req.body.type) || "";
		const loggedInUserId = genericParse(getNonEmptyString, req.user?.id);
		const members = safeParse(getArray<string>, req.body.members) || [
			loggedInUserId,
		];
		const createdGroup = await GroupService.createGroup({
			authorId: loggedInUserId,
			body: { name, icon, banner, type, members },
		});
		return new ApiSuccess<ApiResponses.CreateGroup>(res)
			.status(HTTP.status.CREATED)
			.send(createdGroup);
	}
	public static async updateGroupDetails(
		req: ApiRequest<ApiRequests.UpdateGroup>,
		res: ApiResponse
	) {
		const loggedInUserId = genericParse(getNonEmptyString, req.user?.id);
		const id = genericParse(getNonEmptyString, req.group?.id);
		const name = safeParse(getNonEmptyString, req.body.name) || "";
		const icon = safeParse(getNonEmptyString, req.body.icon) || "";
		const banner = safeParse(getNonEmptyString, req.body.banner) || "";
		const type = safeParse(getNonEmptyString, req.body.type) || "";
		const members = safeParse(getArray<string>, req.body.members);
		const updateBody: Partial<Group> = {};
		if (name) updateBody["name"] = name;
		if (icon) updateBody["icon"] = icon;
		if (banner) updateBody["banner"] = banner;
		if (type) updateBody["type"] = type;
		if (members) updateBody["members"] = members;
		const updatedGroup = await GroupService.updateGroupDetails({
			groupId: id,
			authorId: loggedInUserId,
			updateBody,
		});
		if (updatedGroup == null) {
			return new ApiFailure(res)
				.status(HTTP.status.BAD_REQUEST)
				.message("Nothing to update")
				.send();
		}
		return new ApiSuccess<ApiResponses.UpdateGroupDetails>(res).send(
			updatedGroup
		);
	}
	public static async deleteGroup(
		req: ApiRequest<ApiRequests.DeleteGroup>,
		res: ApiResponse
	) {
		const loggedInUserId = genericParse(getNonEmptyString, req.user?.id);
		const groupId = genericParse(getNonEmptyString, req.group?.id);
		const deletedGroup = await GroupService.deleteGroup({
			groupId,
			loggedInUserId,
		});
		if (deletedGroup == null) {
			return new ApiFailure(res)
				.status(HTTP.status.NOT_FOUND)
				.message("Group not found")
				.send();
		}
		return new ApiSuccess<ApiResponses.DeleteGroup>(res).send(deletedGroup);
	}
	public static async getBalancesSummary(req: ApiRequest, res: ApiResponse) {
		const groupId = genericParse(getNonEmptyString, req.group?.id);
		const groupSummary = await GroupService.getGroupSummary(groupId);
		return new ApiSuccess<ApiResponses.GetBalancesSummary>(res).send(
			groupSummary
		);
	}
	public static async getAllTransactions(req: ApiRequest, res: ApiResponse) {
		const groupId = genericParse(getNonEmptyString, req.group?.id);
		const allTransactionsForGroup =
			await GroupService.getAllGroupTransactions(groupId);
		return new ApiSuccess<ApiResponses.GetTransactions>(res).send(
			allTransactionsForGroup
		);
	}
	public static async addMembers(
		req: ApiRequest<ApiRequests.AddMembers>,
		res: ApiResponse
	) {
		const loggedInUserId = genericParse(getNonEmptyString, req.user?.id);
		const groupId = genericParse(getNonEmptyString, req.group?.id);
		const members = genericParse(getArray<string>, req.body.members);
		const updatedGroup = await GroupService.addMembersInGroup({
			loggedInUserId,
			groupId,
			members,
		});
		if (updatedGroup == null) {
			return new ApiFailure(res)
				.status(HTTP.status.NOT_FOUND)
				.message("Group not found")
				.send();
		}
		return new ApiSuccess<ApiResponses.AddMembers>(res).send(updatedGroup);
	}
}
