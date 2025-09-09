import {
	AuthMapping,
	AuthMappingSchema,
	Group,
	GroupSchema,
	OtpSchema,
	User,
	UserSchema,
} from "@/schema";
import { ModelFactory } from "./base";
import { Otp } from "@/types";

export const AuthMappingModel = new ModelFactory<AuthMapping>(
	"AuthMapping",
	AuthMappingSchema
).model;
export const GroupModel = new ModelFactory<Group>("Group", GroupSchema).model;
export const OtpModel = new ModelFactory<Otp>("Otp", OtpSchema).model;
export const UserModel = new ModelFactory<User>("User", UserSchema).model;
