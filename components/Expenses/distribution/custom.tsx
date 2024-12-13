import { Input } from "@/library";
import { stylesConfig } from "@/utils";
import React from "react";
import { ExpenseUser } from "./assets";
import styles from "./styles.module.scss";

interface ICustomDistributionProps {
	member: ExpenseUser;
	isSelected: boolean;
	onChange: (_: string | number) => void;
}

const classes = stylesConfig(styles, "distribution-member");

export const CustomDistribution: React.FC<ICustomDistributionProps> = ({
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
				onChange(e.target.value);
			}}
		/>
	);
};
