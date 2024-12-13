import { Input } from "@/library";
import { stylesConfig } from "@/utils";
import React from "react";
import { ExpenseUser } from "./assets";
import styles from "./styles.module.scss";

interface IPercentageDistributionProps {
	member: ExpenseUser;
	isSelected: boolean;
	onChange: (_: string | number) => void;
}

const classes = stylesConfig(styles, "distribution-member");

export const PercentageDistribution: React.FC<IPercentageDistributionProps> = ({
	member,
	isSelected,
	onChange,
}) => {
	return (
		<Input
			name="percentage"
			type="text"
			size="small"
			disabled={!isSelected}
			className={classes("-amount")}
			value={member.value}
			onChange={(e: any) => {
				if (!e.target.value.endsWith("%")) {
					e.target.value = e.target.value + "%";
				}
				onChange(e.target.value);
			}}
		/>
	);
};
