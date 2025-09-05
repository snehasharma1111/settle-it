import { Cache } from "@/cache";
import { cacheParameter, HTTP } from "@/constants";
import { ApiError } from "@/errors";
import { userRepo } from "@/repo";
import { User } from "@/schema";
import { CreateModel, IUser } from "@/types";
import { genericParse, getNonEmptyString, getNonNullValue } from "@/utils";

type CollectionUser = { name: string; email: string };

export class UserService {
	public static async getAllUsers(): Promise<Array<IUser>> {
		return await userRepo.findAll();
	}

	public static async getUserById(id: string): Promise<IUser | null> {
		return await Cache.fetch(
			Cache.getKey(cacheParameter.USER, { id }),
			() => userRepo.findById(id)
		);
	}

	public static async findOrCreateUser(
		body: CreateModel<User>
	): Promise<{ user: IUser; isNew: boolean }> {
		const email = genericParse(getNonEmptyString, body.email);
		const foundUser = await userRepo.findOne({ email });
		if (foundUser) {
			return { user: foundUser, isNew: false };
		}
		const createdUser = await userRepo.create(body);
		return { user: createdUser, isNew: true };
	}

	public static async getUsersMapForUserIds(
		userIds: string[]
	): Promise<Map<string, IUser>> {
		const res = await userRepo.find({ _id: { $in: userIds } });
		if (!res) return new Map();
		const parsedRes = res.map(getNonNullValue);
		return new Map<string, IUser>(parsedRes.map((user) => [user.id, user]));
	}

	public static async getUserByEmail(email: string): Promise<IUser | null> {
		try {
			return await userRepo.findOne({ email });
		} catch {
			return null;
		}
	}

	public static async searchByEmail(
		emailQuery: string
	): Promise<Array<IUser>> {
		if (!emailQuery) {
			throw new ApiError(
				HTTP.status.BAD_REQUEST,
				"Email query is required"
			);
		}
		if (emailQuery.length < 3) {
			throw new ApiError(
				HTTP.status.BAD_REQUEST,
				"Email query too short"
			);
		}
		const query = emailQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const res = await userRepo.find({
			email: { $regex: query, $options: "i" },
		});
		if (!res) return [];
		return res;
	}

	public static async updateUserDetails(
		id: string,
		update: Partial<IUser>
	): Promise<IUser | null> {
		const foundUser = await UserService.getUserById(id);
		if (!foundUser) return null;
		const keysToUpdate = ["name", "phone", "avatar"];
		if (Object.keys(update).length == 0) {
			throw new ApiError(
				HTTP.status.BAD_REQUEST,
				"There is nothing to update"
			);
		}
		const updatedBody: any = {};
		Object.keys(update).forEach((key) => {
			if (keysToUpdate.includes(key)) {
				if (
					((update as any)[key] === null ||
						(update as any)[key] === undefined ||
						(update as any)[key] === "") &&
					((foundUser as any)[key] === null ||
						(foundUser as any)[key] === undefined ||
						(foundUser as any)[key] === "")
				) {
					return;
				} else if ((update as any)[key] !== (foundUser as any)[key]) {
					updatedBody[key] = (update as any)[key];
				} else if (!(foundUser as any)[key]) {
					updatedBody[key] = (update as any)[key];
				}
			}
		});
		if (updatedBody.phone) {
			const phoneExists = await userRepo.findOne({
				phone: updatedBody.phone,
			});
			if (phoneExists) {
				throw new ApiError(
					HTTP.status.CONFLICT,
					"Phone number already in use"
				);
			}
		}
		const updatedUser = await userRepo.update({ id }, updatedBody);
		Cache.invalidate(Cache.getKey(cacheParameter.USER, { id }));
		return updatedUser;
	}

	private static isValidEmail(email: string): boolean {
		const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(email);
	}

	private static capitalizeName(name: string): string {
		return name
			.split(/\s+/)
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
			.join(" ");
	}

	private static getDistinctUsersFromCollection = (
		users: Array<CollectionUser>
	) => {
		const m = new Map();
		users.forEach((user) => {
			if (m.has(user.email)) {
				const us = m.get(user.email);
				m.set(user.email, [...us, user.name]);
			} else {
				m.set(user.email, [user.name]);
			}
		});
		const finals: Array<CollectionUser> = [];
		m.forEach((value, key) => {
			const email = key;
			let name = value[0];
			if (value.length === 0) {
				name = UserService.capitalizeName(email.split("@")[0]);
			} else if (value.length === 1) {
				name = value[0];
			} else {
				for (const v of value) {
					if (v.length > name.length) {
						name = v;
					}
				}
			}
			finals.push({ name, email });
		});
		return finals;
	};
}
