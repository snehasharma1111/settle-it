import { HTTP } from "@/constants";
import { Group } from "@/models";
import { groupService } from "@/services/api";
import { ApiRequest, ApiResponse } from "@/types/api";
import {
	genericParse,
	getArray,
	getNonEmptyString,
	safeParse,
} from "@/utils/safety";

export const getAllGroups = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const loggedInUserId = getNonEmptyString(req.user?.id);
		// search for group whose members array contains loggedInUserId
		const groups = await groupService.getGroupsUserIsPartOf(loggedInUserId);
		return res
			.status(HTTP.status.SUCCESS)
			.json({ message: HTTP.message.SUCCESS, data: groups });
	} catch (error) {
		return res
			.status(HTTP.status.INTERNAL_SERVER_ERROR)
			.json({ message: HTTP.message.INTERNAL_SERVER_ERROR });
	}
};

export const createGroup = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const name = genericParse(getNonEmptyString, req.body.name);
		const icon = safeParse(getNonEmptyString, req.body.icon);
		const banner = safeParse(getNonEmptyString, req.body.banner);
		const type = safeParse(getNonEmptyString, req.body.type);
		const loggedInUserId = getNonEmptyString(req.user?.id);
		const members = safeParse(getArray<string>, req.body.members) || [
			loggedInUserId,
		];
		if (!members.includes(loggedInUserId)) {
			members.push(loggedInUserId);
		}
		const foundGroup = await groupService.findOne({ name });
		if (foundGroup)
			return res
				.status(HTTP.status.CONFLICT)
				.json({ message: "Group already exists" });
		const newGroupBody: Omit<Group, "id" | "createdAt" | "updatedAt"> = {
			name,
			createdBy: loggedInUserId,
			members,
		};
		if (icon) newGroupBody.icon = icon;
		if (banner) newGroupBody.banner = banner;
		if (type) newGroupBody.type = type;
		const createdGroup = await groupService.create(newGroupBody);
		return res.status(HTTP.status.CREATED).json({
			message: "Group created successfully",
			data: createdGroup,
		});
	} catch (error: any) {
		console.error(error);
		if (error.message && error.message.startsWith("Invalid input:")) {
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: HTTP.message.BAD_REQUEST });
		} else {
			return res.status(HTTP.status.INTERNAL_SERVER_ERROR).json({
				message: HTTP.message.INTERNAL_SERVER_ERROR,
			});
		}
	}
};

export const updateGroup = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const loggedInUserId = getNonEmptyString(req.user?.id);
		const id = getNonEmptyString(req.query.id);
		const icon = safeParse(getNonEmptyString, req.body.icon);
		const banner = safeParse(getNonEmptyString, req.body.banner);
		const type = safeParse(getNonEmptyString, req.body.type);
		if (!id || !loggedInUserId)
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: HTTP.message.BAD_REQUEST });
		const foundGroup = await groupService.findById(id);
		if (!foundGroup)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		const newGroupBody: Partial<Group> = {};
		if (icon) newGroupBody.icon = icon;
		if (banner) newGroupBody.banner = banner;
		if (type) newGroupBody.type = type;
		const updatedGroup = await groupService.update({ id }, newGroupBody);
		return res.status(HTTP.status.SUCCESS).json({
			message: HTTP.message.SUCCESS,
			data: updatedGroup,
		});
	} catch (error: any) {
		console.error(error);
		if (error.message && error.message.startsWith("Invalid input:")) {
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: HTTP.message.BAD_REQUEST });
		} else {
			return res.status(HTTP.status.INTERNAL_SERVER_ERROR).json({
				message: HTTP.message.INTERNAL_SERVER_ERROR,
			});
		}
	}
};

export const deleteGroup = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const loggedInUserId = getNonEmptyString(req.user?.id);
		const id = getNonEmptyString(req.query.id);
		if (!id || !loggedInUserId)
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: HTTP.message.BAD_REQUEST });
		const foundGroup = await groupService.findById(id);
		if (!foundGroup)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		if (foundGroup.createdBy !== loggedInUserId)
			return res
				.status(HTTP.status.FORBIDDEN)
				.json({ message: HTTP.message.FORBIDDEN });
		await groupService.clear(id);
		const deletedGroup = await groupService.remove({ id });
		return res.status(HTTP.status.SUCCESS).json({
			message: HTTP.message.SUCCESS,
			data: deletedGroup,
		});
	} catch (error: any) {
		console.error(error);
		if (error.message && error.message.startsWith("Invalid input:")) {
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: HTTP.message.BAD_REQUEST });
		} else {
			return res.status(HTTP.status.INTERNAL_SERVER_ERROR).json({
				message: HTTP.message.INTERNAL_SERVER_ERROR,
			});
		}
	}
};

export const addGroupMembers = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const loggedInUserId = getNonEmptyString(req.user?.id);
		const id = getNonEmptyString(req.query.id);
		const members = genericParse(getArray<string>, req.body.members);
		if (members.length === 0)
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: HTTP.message.BAD_REQUEST });
		const foundGroup = await groupService.findById(id);
		if (!foundGroup)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		if (foundGroup.createdBy !== loggedInUserId)
			return res
				.status(HTTP.status.FORBIDDEN)
				.json({ message: HTTP.message.FORBIDDEN });
		const membersToAdd = members.filter(
			(member) => !foundGroup.members.includes(member)
		);
		const updatedGroup = await groupService.addMembers(id, membersToAdd);
		return res.status(HTTP.status.SUCCESS).json({
			message: HTTP.message.SUCCESS,
			data: updatedGroup,
		});
	} catch (error: any) {
		console.error(error);
		if (error.message && error.message.startsWith("Invalid input:")) {
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: HTTP.message.BAD_REQUEST });
		} else {
			return res.status(HTTP.status.INTERNAL_SERVER_ERROR).json({
				message: HTTP.message.INTERNAL_SERVER_ERROR,
			});
		}
	}
};

export const removeGroupMembers = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const loggedInUserId = getNonEmptyString(req.user?.id);
		const id = getNonEmptyString(req.query.id);
		const members = genericParse(getArray<string>, req.body.members);
		if (members.length === 0)
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: HTTP.message.BAD_REQUEST });
		const foundGroup = await groupService.findById(id);
		if (!foundGroup)
			return res
				.status(HTTP.status.NOT_FOUND)
				.json({ message: HTTP.message.NOT_FOUND });
		if (foundGroup.createdBy !== loggedInUserId)
			return res
				.status(HTTP.status.FORBIDDEN)
				.json({ message: HTTP.message.FORBIDDEN });
		const membersToRemove = members.filter((member) =>
			foundGroup.members.includes(member)
		);
		const updatedGroup = await groupService.removeMembers(
			id,
			membersToRemove
		);
		return res.status(HTTP.status.SUCCESS).json({
			message: HTTP.message.SUCCESS,
			data: updatedGroup,
		});
	} catch (error: any) {
		console.error(error);
		if (error.message && error.message.startsWith("Invalid input:")) {
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: HTTP.message.BAD_REQUEST });
		} else {
			return res.status(HTTP.status.INTERNAL_SERVER_ERROR).json({
				message: HTTP.message.INTERNAL_SERVER_ERROR,
			});
		}
	}
};
