import { AuthMapping, Group, User } from "@/schema";
import { UpdateModel } from "@/types/parser";

// User
export type IUser = Omit<User, "createdAt" | "updatedAt">;
export type UpdateUser = Omit<UpdateModel<User>, "email">;
export type IAuthMapping = Omit<AuthMapping, "user"> & { user: IUser | null };

// Group
export type IGroup = Omit<Group, "members" | "createdBy"> & {
	members: Array<IUser>;
	createdBy: IUser;
};
export type CreateGroupData = Omit<
	Group,
	"id" | "createdBy" | "createdAt" | "updatedAt"
>;
export type UpdateGroupData = CreateGroupData;
