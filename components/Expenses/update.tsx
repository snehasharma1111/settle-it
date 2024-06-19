import { useStore } from "@/hooks";
import { Responsive } from "@/layouts";
import { Button, Input, Popup } from "@/library";
import { UpdateExpenseData } from "@/types/expense";
import { stylesConfig } from "@/utils/functions";
import React, { useEffect, useState } from "react";
import Members, { ExpenseUser } from "./members";
import styles from "./styles.module.scss";
import { getNonNullValue } from "@/utils/safety";
import { notify } from "@/messages";
import { api } from "@/connections";

interface IUpdateExpenseProps {
	id: string;
	groupId: string;
	onClose: () => void;
	onSave: (_: UpdateExpenseData) => void;
	loading: boolean;
}

const classes = stylesConfig(styles, "update-expense");

const UpdateExpense: React.FC<IUpdateExpenseProps> = ({
	id,
	groupId,
	onClose,
	onSave,
	loading,
}) => {
	const { user: loggedInuser, groups, expenses } = useStore();
	const originalExpense = getNonNullValue(
		expenses.find((expense) => expense.id === id)
	);
	const group = groups.find((group) => group.id === groupId);
	const [gettingMembers, setGettingMembers] = useState(false);
	const [fields, setFields] = useState<UpdateExpenseData>({
		title: originalExpense.title,
		amount: originalExpense.amount,
		groupId,
		paidBy: originalExpense.paidBy.id,
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

	useEffect(() => {
		const getMembersForExpense = async () => {
			setGettingMembers(true);
			try {
				const res = await api.expense.getMembersOfExpense(id);
				setFields({
					...fields,
					members: res.data.map((member) => ({
						userId: member.user.id,
						amount: member.amount,
					})),
				});
				setSelectedMembers(
					res.data.map((member) => ({
						...member.user,
						amount: member.amount,
					}))
				);
			} catch (error) {
				notify.error(error);
			} finally {
				setGettingMembers(false);
			}
		};
		getMembersForExpense();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	if (!group) return null;

	return (
		<Popup
			onClose={onClose}
			title={`Update Expense - ${originalExpense.title}`}
			className={classes("")}
			height="auto"
		>
			{gettingMembers ? (
				<Responsive.Row>
					{Array(6)
						.fill(0)
						.map((_, index) => (
							<Responsive.Col
								key={`expense-${id}-member-${index}`}
								xlg={50}
								lg={50}
								md={100}
								sm={100}
								xsm={100}
							>
								<span className={classes("-skeleton")} />
							</Responsive.Col>
						))}
				</Responsive.Row>
			) : (
				<form className={classes("-form")} onSubmit={handleSubmit}>
					<Responsive.Row>
						<Responsive.Col
							xlg={33}
							lg={33}
							md={50}
							sm={100}
							xsm={100}
						>
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
						<Responsive.Col
							xlg={33}
							lg={33}
							md={50}
							sm={100}
							xsm={100}
						>
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
						<Responsive.Col
							xlg={33}
							lg={33}
							md={50}
							sm={100}
							xsm={100}
						>
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
										setFields({
											...fields,
											paidBy: user.id,
										});
									},
								}}
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
							if (loading) return "Saving...";
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
									.reduce((a, b) => a + b, 0) !==
								fields.amount
							)
								return "Enter Amount for all members";
							return "Save";
						})()}
						disabled={
							loading ||
							fields.amount <= 0 ||
							selectedMembers.some(
								(member) => member.amount === 0
							) ||
							selectedMembers
								.map((user) => user.amount)
								.reduce((a, b) => a + b, 0) !== fields.amount
						}
					>
						Save
					</Button>
				</form>
			)}
		</Popup>
	);
};

export default UpdateExpense;
