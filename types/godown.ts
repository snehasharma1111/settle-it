import { IUser } from "./user";

export type IGodown = {
	users: Array<IUser>;
};

export type IShare = {
	user: IUser;
	amount: number;
	percentage: number;
	fraction: string;
	opacity: number;
};
