import { UpdateExpense, ViewExpense } from "@/components";
import { Typography } from "@/library";
import { IExpense, UpdateExpenseData } from "@/types/expense";
import { stylesConfig } from "@/utils/functions";
import moment from "moment";
import React, { useState } from "react";
import styles from "./styles.module.scss";
import { useStore } from "@/hooks";
import { notify } from "@/messages";

interface IExpenseProps extends IExpense {}

const classes = stylesConfig(styles, "expense");

const Expense: React.FC<IExpenseProps> = ({
	id,
	title,
	createdAt,
	paidBy,
	amount,
	group,
}) => {
	const { dispatch, updateExpense } = useStore();
	const [openViewExpensePopup, setOpenViewExpensePopup] = useState(false);
	const [openEditExpensePopup, setOpenEditExpensePopup] = useState(false);
	const [updating, setUpdating] = useState(false);

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
						{moment(createdAt).format("MMM DD, YYYY")}
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
		</>
	);
};

export default Expense;
