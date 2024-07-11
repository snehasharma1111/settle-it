import { api } from "@/connections";
import { fallbackAssets } from "@/constants";
import { useStore } from "@/hooks";
import { Responsive } from "@/layouts";
import { Avatar, Button, Popup, Typography } from "@/library";
import { notify } from "@/messages";
import { IExpense } from "@/types/expense";
import { IMember } from "@/types/member";
import { stylesConfig } from "@/utils/functions";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { IoCheckmarkOutline } from "react-icons/io5";
import styles from "./styles.module.scss";

interface IViewExpenseProps {
	id: string;
	onClose: () => void;
	onSwitchToEdit: () => void;
	onDelete: () => void;
}

interface ExpenseMemberProps extends IMember {
	expense: IExpense;
	onUpdateMembers: (_: Array<IMember>) => void;
}

const classes = stylesConfig(styles, "view-expense");

const ExpenseMember: React.FC<ExpenseMemberProps> = ({
	id,
	expense,
	user,
	owed,
	paid,
	onUpdateMembers,
}) => {
	const { user: loggedInUser } = useStore();
	const [settling, setSettling] = useState(false);
	const settleMember = async () => {
		try {
			setSettling(true);
			const updatedMembersRes = await api.members.settleMemberInExpense(
				expense.id,
				id
			);
			onUpdateMembers(updatedMembersRes.data);
		} catch (error) {
			notify.error(error);
		} finally {
			setSettling(false);
		}
	};
	return (
		<div className={classes("-member")}>
			<Avatar
				src={user.avatar || fallbackAssets.avatar}
				alt={user.name || user.email}
				size={36}
			/>
			{(() => {
				if (expense.paidBy.id === user.id) {
					return (
						<>
							<Typography size="sm">
								{expense.paidBy.name ||
									expense.paidBy.email.slice(0, 7) + "..."}
							</Typography>{" "}
							<Typography
								size="sm"
								style={{
									color: owed === 0 ? "green" : "red",
								}}
							>
								paid {paid}
							</Typography>{" "}
							<Typography size="sm">for this expense</Typography>
						</>
					);
				} else {
					if (owed === 0) {
						return (
							<>
								<Typography size="sm">
									{user.name ||
										user.email.slice(0, 7) + "..."}{" "}
									has
								</Typography>{" "}
								<Typography
									size="sm"
									style={{
										color: owed === 0 ? "green" : "red",
									}}
								>
									paid {paid}
								</Typography>{" "}
								<Typography size="sm">
									to{" "}
									{expense.paidBy.name ||
										expense.paidBy.email.slice(0, 7) +
											"..."}
								</Typography>
							</>
						);
					} else {
						return (
							<>
								<Typography size="sm">
									{user.name ||
										user.email.slice(0, 7) + "..."}
								</Typography>{" "}
								<Typography
									size="sm"
									style={{
										color: owed === 0 ? "green" : "red",
									}}
								>
									owes {owed}
								</Typography>{" "}
								<Typography size="sm">
									to{" "}
									{expense.paidBy.name ||
										expense.paidBy.email.slice(0, 7) +
											"..."}
								</Typography>
							</>
						);
					}
				}
			})()}
			{expense.paidBy.id === loggedInUser.id ? (
				<button
					disabled={owed === 0 || settling}
					className={classes("-btn", {
						"-ben--settled": owed === 0,
					})}
					onClick={settleMember}
				>
					{owed === 0 ? (
						"Settled"
					) : settling ? (
						<span className={classes("-btn--loader")} />
					) : (
						"Settle"
					)}
				</button>
			) : owed === 0 ? (
				<Typography
					size="sm"
					style={{
						color: owed === 0 ? "green" : "red",
					}}
					className={classes("-btn", "-btn--disabled")}
				>
					Settled
				</Typography>
			) : null}
		</div>
	);
};

const ViewExpense: React.FC<IViewExpenseProps> = ({
	id,
	onClose,
	onSwitchToEdit,
	onDelete,
}) => {
	const { expenses, user: loggedInUser } = useStore();
	const [settlingExpense, setSettlingExpense] = useState(false);
	const [members, setMembers] = useState<Array<IMember>>([]);
	const [gettingMembers, setGettingMembers] = useState(false);
	const expense = expenses.find((exp) => exp.id === id);

	const settleExpense = async () => {
		try {
			setSettlingExpense(true);
			const updatedMembersRes = await api.expense.settleExpense(id);
			setMembers(updatedMembersRes.data);
			notify.success("This expense has been settled");
		} catch (error) {
			notify.error(error);
		} finally {
			setSettlingExpense(false);
		}
	};

	useEffect(() => {
		const getMembersForExpense = async () => {
			setGettingMembers(true);
			try {
				const res = await api.expense.getMembersOfExpense(id);
				setMembers(res.data);
			} catch (error) {
				notify.error(error);
			} finally {
				setGettingMembers(false);
			}
		};
		getMembersForExpense();
	}, [id]);

	if (!expense) return null;

	return (
		<Popup
			onClose={onClose}
			onEdit={
				expense.createdBy.id === loggedInUser.id ||
				expense.paidBy.id === loggedInUser.id
					? onSwitchToEdit
					: undefined
			}
			onDelete={
				expense.createdBy.id === loggedInUser.id ||
				expense.paidBy.id === loggedInUser.id
					? onDelete
					: undefined
			}
			title={expense.title}
			width="500px"
		>
			<div className={classes("")}>
				<div className={classes("-card")}>
					<div className={classes("-card-details")}>
						<Typography className={classes("-card-title")}>
							{expense.title}
						</Typography>
						<Typography size="sm">
							{moment(expense.paidOn ?? expense.createdAt).format(
								"MMM DD, YYYY"
							)}
						</Typography>
					</div>
					<div className={classes("-card-paid")}>
						{expense.paidBy.name ||
							expense.paidBy.email.slice(0, 7) + "..."}
						<Typography size="sm">paid {expense.amount}</Typography>
					</div>
				</div>
				{expense.description ? (
					<Typography
						as="p"
						size="sm"
						className={classes("-description")}
					>
						{expense.description}
					</Typography>
				) : null}
				<div className={classes("-members")}>
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
										<span
											className={classes("-skeleton")}
										/>
									</Responsive.Col>
								))}
						</Responsive.Row>
					) : (
						members.map((member, index) => (
							<ExpenseMember
								key={`expense-${id}-member-${index}`}
								{...member}
								expense={expense}
								onUpdateMembers={(newMembers) => {
									setMembers(newMembers);
								}}
							/>
						))
					)}
				</div>
				{gettingMembers ? null : (
					<div className={classes("-status")}>
						{members
							.map((mem) => mem.owed)
							.every((val) => val === 0) ? (
							<Typography>
								<IoCheckmarkOutline />
								Settled
							</Typography>
						) : expense.paidBy.id === loggedInUser.id ? (
							<Button
								onClick={settleExpense}
								loading={settlingExpense}
							>
								Settle
							</Button>
						) : null}
					</div>
				)}
			</div>
		</Popup>
	);
};

export default ViewExpense;
