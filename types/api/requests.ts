import { CreateGroupData, IUser, UpdateGroupData } from "@/types";

// Auth
export type VerifyGoogleOAuth = { code: string };
export type ContinueGoogleOAuth = { token: string };
export type VerifyUser = IUser;
export type RequestOtp = { email: string };
export type VerifyOtp = { email: string; otp: string };
export type Logout = null;

// User
export type UpdateUser = Partial<IUser>;

// Group
export type CreateGroup = CreateGroupData;
export type UpdateGroup = UpdateGroupData;
export type DeleteGroup = { id: string };
export type AddMembers = { members: string[] };
