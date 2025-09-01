import { AuthMapping, AuthMappingSchema, User, UserSchema } from "@/schema";
import { ModelFactory } from "./base";

export const AuthMappingModel = new ModelFactory<AuthMapping>(
	"AuthMapping",
	AuthMappingSchema
).model;

export const UserModel = new ModelFactory<User>("User", UserSchema).model;
