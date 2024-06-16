import { Group } from "@/models";
import { IUser } from "./user";

export type IGroup = Omit<Group, "members" | "createdBy"> & {
	members: Array<IUser>;
	createdBy: IUser;
};

export type CreateGroupData = {
	name: string;
	icon?: string;
	banner?: string;
	type: string;
	members: string[];
};
