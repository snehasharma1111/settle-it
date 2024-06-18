import { ViewExpense } from "@/components";
import { Typography } from "@/library";
import { IExpense } from "@/types/expense";
import { stylesConfig } from "@/utils/functions";
import moment from "moment";
import React, { useState } from "react";
import styles from "./styles.module.scss";

interface IExpenseProps extends IExpense {}

const classes = stylesConfig(styles, "expense");

const Expense: React.FC<IExpenseProps> = ({
	id,
	title,
	createdAt,
	paidBy,
	amount,
}) => {
	const [openViewExpensePopup, setOpenViewExpensePopup] = useState(false);
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
				/>
			) : null}
		</>
	);
};

export default Expense;
