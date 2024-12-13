import { ExpenseCard } from "@/components";
import { IExpense } from "@/types";
import { stylesConfig } from "@/utils";
import React from "react";
import styles from "./styles.module.scss";

interface IGroupHomeProps {
	expenses: Array<IExpense>;
}

const classes = stylesConfig(styles, "group-home");

const GroupHome: React.FC<IGroupHomeProps> = ({ expenses }) => {
	return (
		<div className={classes("")}>
			{expenses.map((expense) => (
				<ExpenseCard key={`group-expense-${expense.id}`} {...expense} />
			))}
		</div>
	);
};

export default GroupHome;
