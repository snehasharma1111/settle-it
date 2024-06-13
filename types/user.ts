import { User } from "@/models";

export type T_USER_STATUS = "JOINED" | "INVITED";
export type T_OTP_STATUS = "PENDING" | "VERIFIED" | "EXPIRED";
export type T_EXPENSE_STATUS = "PENDING" | "SETTLED";

export interface IUser extends Omit<User, "createdAt" | "updatedAt"> {}
