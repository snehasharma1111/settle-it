import { jwtSecret } from "@/config";
import jwt from "jsonwebtoken";
import { userService } from "@/services/api";
import { User } from "@/models";

export const authenticate = async (token: string): Promise<User | null> => {
	try {
		const decoded: any = jwt.verify(token, jwtSecret);
		const foundUser = await userService.find({ id: decoded.id });
		if (!foundUser) {
			return null;
		}
		return foundUser as User;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const generateToken = (id: string): string =>
	jwt.sign({ id }, jwtSecret, {
		expiresIn: "30d",
	});
