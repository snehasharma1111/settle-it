import { Typography } from "@/library";
import { stylesConfig } from "@/utils";
import React from "react";
import { ExpenseUser } from "./assets";
import styles from "./styles.module.scss";

interface IEqualDistributionProps {
	member: ExpenseUser;
}

const classes = stylesConfig(styles, "distribution-member");

export const EqualDistribution: React.FC<IEqualDistributionProps> = ({
	member,
}) => {
	return (
		<Typography className={classes("-amount")}>{member.value}</Typography>
	);
};
