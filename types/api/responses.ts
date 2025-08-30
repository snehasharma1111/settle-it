import { IUser } from "@/types";

// Auth
export type VerifyUser = IUser;
export type VerifyGoogleOAuth = string;
export type ContinueGoogleOAuth = IUser;
export type RequestOtp = null;
export type VerifyOtp = IUser;
export type Logout = null;

// User
export type UpdateUser = IUser;
export type SearchUsers = Array<IUser>;
export type InviteUser = IUser;
export type BulkUserSearch = {
	users: Array<IUser>;
	message: string;
};
