import { useStore } from "@/hooks";
import { Responsive } from "@/layouts";
import { Button, Input, Popup } from "@/library";
import { CreateExpenseData } from "@/types/expense";
import { stylesConfig } from "@/utils/functions";
import React, { useState } from "react";
import Members, { ExpenseUser } from "./members";
import styles from "./styles.module.scss";

interface ICreateExpenseProps {
	groupId: string;
	onClose: () => void;
	onSave: (_: CreateExpenseData) => void;
	loading: boolean;
}

const classes = stylesConfig(styles, "create-expense");

const CreateExpense: React.FC<ICreateExpenseProps> = ({
	groupId,
	onClose,
	onSave,
	loading,
}) => {
	const { user: loggedInuser, groups } = useStore();
	const group = groups.find((group) => group.id === groupId);
	const [fields, setFields] = useState<CreateExpenseData>({
		title: "",
		amount: 0,
		groupId,
		paidBy: loggedInuser.id,
		members: [],
	});
	const [selectedMembers, setSelectedMembers] = useState<Array<ExpenseUser>>(
		group?.members.map((member) => ({ ...member, amount: 0 })) || []
	);
	const handleChange = (e: any) => {
		const { name, value } = e.target;
		if (name === "amount") {
			setSelectedMembers((members) => {
				const newMembers = [...members];
				newMembers.forEach((member) => {
					member.amount = value / newMembers.length;
				});
				return newMembers;
			});
			setFields({ ...fields, [name]: +value });
		} else {
			setFields({ ...fields, [name]: value });
		}
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		/* if (selectedMembers.map((user) => user.id).includes(loggedInuser.id)) {
			onSave({
				...fields,
				members: selectedMembers.map((user) => ({
					userId: user.id,
					amount: user.amount,
				})),
			});
		} else {
			onSave({
				...fields,
				members: [
					...selectedMembers.map((user) => ({
						userId: user.id,
						amount: user.amount,
					})),
					{
						userId: loggedInuser.id,
						amount:
							fields.amount -
							fields.members.reduce((a, b) => a + b.amount, 0),
					},
				],
			});
		} */
		onSave({
			...fields,
			members: selectedMembers.map((user) => ({
				userId: user.id,
				amount: user.amount,
			})),
		});
	};

	if (!group) return null;

	return (
		<Popup
			onClose={onClose}
			title="Add Expense"
			className={classes("")}
			height="auto"
		>
			<form className={classes("-form")} onSubmit={handleSubmit}>
				<Responsive.Row>
					<Responsive.Col xlg={33} lg={33} md={50} sm={100} xsm={100}>
						<Input
							label="Title"
							name="title"
							placeholder="Title e.g. Food"
							type="text"
							size="small"
							required
							value={fields.title}
							onChange={handleChange}
						/>
					</Responsive.Col>
					<Responsive.Col xlg={33} lg={33} md={50} sm={100} xsm={100}>
						<Input
							label="Amount"
							name="amount"
							placeholder="Amount e.g. 100"
							type="number"
							size="small"
							required
							value={fields.amount}
							onChange={handleChange}
						/>
					</Responsive.Col>
					<Responsive.Col xlg={33} lg={33} md={50} sm={100} xsm={100}>
						<Input
							label="Paid By"
							name="paidBy"
							placeholder={loggedInuser.name}
							size="small"
							required
							value={(() => {
								const foundMember = group.members.find(
									(user) => user.id === fields.paidBy
								);
								if (foundMember) {
									if (foundMember.name) {
										return foundMember.name;
									}
									return foundMember.email;
								}
								return loggedInuser.name;
							})()}
							dropdown={{
								enabled: true,
								options: group.members.map((user) => ({
									id: user.id,
									label: user.name || user.email,
									value: user.id,
								})),
								onSelect(user) {
									setFields({ ...fields, paidBy: user.id });
								},
							}}
							// onChange={handleChange}
						/>
					</Responsive.Col>
					<Members
						allMembers={group.members}
						selectedMembers={selectedMembers}
						setSelectedMembers={(newMembers) => {
							setSelectedMembers(newMembers);
						}}
					/>
				</Responsive.Row>
				<Button
					className={classes("-submit")}
					type="submit"
					loading={loading}
					title={(() => {
						if (loading) return "Creating...";
						if (fields.amount <= 0) return "Enter Amount";
						if (
							selectedMembers.some(
								(member) => member.amount === 0
							)
						)
							return "Enter Amount for all members";
						if (
							selectedMembers
								.map((user) => user.amount)
								.reduce((a, b) => a + b, 0) !== fields.amount
						)
							return "Enter Amount for all members";
						return "Create";
					})()}
					disabled={
						loading ||
						fields.amount <= 0 ||
						selectedMembers.some((member) => member.amount === 0) ||
						selectedMembers
							.map((user) => user.amount)
							.reduce((a, b) => a + b, 0) !== fields.amount
					}
				>
					Create
				</Button>
			</form>
		</Popup>
	);
};

export default CreateExpense;
