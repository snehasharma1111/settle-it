import { UpdateExpense, ViewExpense, useConfirmationModal } from "@/components";
import { useStore } from "@/hooks";
import { Typography } from "@/library";
import { notify } from "@/messages";
import { IExpense, UpdateExpenseData } from "@/types/expense";
import { stylesConfig } from "@/utils/functions";
import moment from "moment";
import React, { useState } from "react";
import styles from "./styles.module.scss";

interface IExpenseProps extends IExpense {}

const classes = stylesConfig(styles, "expense");

const Expense: React.FC<IExpenseProps> = ({
	id,
	title,
	paidOn,
	createdAt,
	paidBy,
	amount,
	group,
}) => {
	const { dispatch, updateExpense, removeExpense } = useStore();
	const [openViewExpensePopup, setOpenViewExpensePopup] = useState(false);
	const [openEditExpensePopup, setOpenEditExpensePopup] = useState(false);
	const [updating, setUpdating] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const updateExpenseHelper = async (data: UpdateExpenseData) => {
		setUpdating(true);
		try {
			await dispatch(updateExpense({ id, data })).unwrap();
			setOpenEditExpensePopup(false);
			setOpenViewExpensePopup(true);
		} catch (error) {
			notify.error(error);
		} finally {
			setUpdating(false);
		}
	};

	const deleteExpenseHelper = async () => {
		setDeleting(true);
		try {
			await dispatch(removeExpense(id)).unwrap();
			setOpenEditExpensePopup(false);
			setOpenViewExpensePopup(false);
		} catch (error) {
			notify.error(error);
		} finally {
			setDeleting(false);
		}
	};

	const deleteExpenseConfirmation = useConfirmationModal(
		`Delete Expense ${title}`,
		<>
			Are you sure you want to delete this expense?
			<br />
			This action cannot be undone
		</>,
		async () => {
			await deleteExpenseHelper();
		},
		() => {
			setOpenEditExpensePopup(false);
			setOpenViewExpensePopup(false);
		},
		deleting
	);

	return (
		<>
			<div
				className={classes("")}
				onClick={() => setOpenViewExpensePopup(true)}
			>
				<div className={classes("-details")}>
					<Typography className={classes("-title")}>
						{title}
					</Typography>
					<Typography size="sm">
						{moment(paidOn ?? createdAt).format("MMM DD, YYYY")}
					</Typography>
				</div>
				<div className={classes("-paid")}>
					{paidBy.name || paidBy.email.slice(0, 7) + "..."}
					<Typography size="sm">paid {amount}</Typography>
				</div>
			</div>
			{openViewExpensePopup ? (
				<ViewExpense
					id={id}
					onClose={() => setOpenViewExpensePopup(false)}
					onSwitchToEdit={() => {
						setOpenViewExpensePopup(false);
						setOpenEditExpensePopup(true);
					}}
					onDelete={() => {
						setOpenViewExpensePopup(false);
						deleteExpenseConfirmation.openPopup();
					}}
				/>
			) : null}
			{openEditExpensePopup ? (
				<UpdateExpense
					id={id}
					loading={updating}
					groupId={group.id}
					onClose={() => setOpenEditExpensePopup(false)}
					onSave={updateExpenseHelper}
				/>
			) : null}
			{deleteExpenseConfirmation.showPopup
				? deleteExpenseConfirmation.Modal
				: null}
		</>
	);
};

export default Expense;
