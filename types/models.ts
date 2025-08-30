import { T_OTP_STATUS, T_USER_STATUS } from "./user";

export type Expense = {
	id: string;
	title: string;
	amount: number;
	groupId: string;
	paidBy: string;
	createdBy: string;
	description?: string;
	paidOn?: string;
	createdAt: string;
	updatedAt: string;
};

export type Group = {
	id: string;
	name: string;
	icon?: string;
	banner?: string;
	type?: string;
	members: string[];
	createdBy: string;
	createdAt: string;
	updatedAt: string;
};

export type Member = {
	id: string;
	userId: string;
	groupId: string;
	expenseId: string;
	amount: number;
	owed: number;
	paid: number;
	createdAt: string;
	updatedAt: string;
};

export type Otp = {
	id: string;
	email: string;
	otp: string;
	status: T_OTP_STATUS;
	createdAt: string;
	updatedAt: string;
};
