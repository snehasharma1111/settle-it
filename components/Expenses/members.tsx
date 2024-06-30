import React from "react";
import { stylesConfig } from "@/utils/functions";
import styles from "./styles.module.scss";
import { IUser } from "@/types/user";
import { Responsive } from "@/layouts";
import { Avatar, CheckBox, Input, Typography } from "@/library";
import { fallbackAssets } from "@/constants";

export type ExpenseUser = IUser & {
	amount: number;
};
interface IExpenseMembersProps {
	totalAmount: number;
	allMembers: Array<IUser>;
	selectedMembers: Array<ExpenseUser>;
	setSelectedMembers: (_: Array<ExpenseUser>) => void;
}

const classes = stylesConfig(styles, "create-expense");

const ExpenseMembers: React.FC<IExpenseMembersProps> = ({
	totalAmount,
	allMembers,
	selectedMembers,
	setSelectedMembers,
}) => {
	const handleSelectUser = (member: IUser) => {
		let newMembers = [...selectedMembers];
		if (selectedMembers.map((user) => user.id).includes(member.id)) {
			newMembers = newMembers.filter((user) => user.id !== member.id);
		} else {
			newMembers = [
				...selectedMembers,
				{
					...member,
					amount: Math.max(
						totalAmount -
							selectedMembers.reduce((a, b) => a + b.amount, 0),
						0
					),
				},
			];
		}
		setSelectedMembers(newMembers);
	};

	const handleChangeMemberAmount = (member: IUser, amount: number) => {
		const newMembers = [...selectedMembers];
		newMembers.forEach((m) => {
			if (m.id === member.id) {
				m.amount = amount;
			}
		});
		setSelectedMembers(newMembers);
	};

	return (
		<Responsive.Col
			xlg={100}
			lg={100}
			md={100}
			sm={100}
			xsm={100}
			className={classes("-members")}
		>
			{allMembers.map((member) => (
				<div className={classes("-member")} key={`member-${member.id}`}>
					<CheckBox
						checked={selectedMembers
							.map((user) => user.id)
							.includes(member.id)}
						onChange={() => {
							handleSelectUser(member);
						}}
					/>
					<Avatar
						src={member.avatar || fallbackAssets.avatar}
						alt={member.name || member.email}
						size={32}
					/>
					<Typography>{member.name || member.email}</Typography>
					<Input
						name="amount"
						type="number"
						size="small"
						disabled={
							!selectedMembers
								.map((user) => user.id)
								.includes(member.id)
						}
						className={classes("-member-amount")}
						value={
							selectedMembers.find(
								(user) => user.id === member.id
							)?.amount || 0
						}
						onChange={(e: any) => {
							if (
								e.target.value.startsWith("0") &&
								e.target.value.length > 1
							) {
								e.target.value = e.target.value.slice(1);
							}
							handleChangeMemberAmount(member, +e.target.value);
						}}
					/>
				</div>
			))}
		</Responsive.Col>
	);
};

export default ExpenseMembers;
