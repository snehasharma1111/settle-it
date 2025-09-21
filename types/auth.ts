import { IUser } from "./client";

export type Cookie = {
	name: string;
	value: string;
	maxAge: number;
};

export type AuthResponse = {
	user: IUser;
	cookies: Array<Cookie>;
	isNew?: boolean;
};

export type Tokens = {
	accessToken: string;
	refreshToken: string;
};
