import { AuthMapping, User } from "@/schema";
import { UpdateModel } from "@/types/parser";

export type T_USER_STATUS = "JOINED" | "INVITED";
export type T_OTP_STATUS = "PENDING" | "EXPIRED";
export type T_EXPENSE_STATUS = "PENDING" | "SETTLED";

export type IUser = Omit<User, "createdAt" | "updatedAt">;
export type UpdateUser = Omit<UpdateModel<User>, "email">;
export type IAuthMapping = Omit<AuthMapping, "user"> & { user: IUser | null };
