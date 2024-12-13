import { fallbackAssets } from "@/constants";
import { Avatar, CheckBox, Typography } from "@/library";
import { stylesConfig } from "@/utils";
import React from "react";
import { DistributionMethod, distributionMethods, ExpenseUser } from "./assets";
import { CustomDistribution } from "./custom";
import { EqualDistribution } from "./equal";
import { FractionDistribution } from "./fraction";
import { PercentageDistribution } from "./percentage";
import styles from "./styles.module.scss";

interface IDistributionMemberProps {
	member: ExpenseUser;
	distributionMethod: DistributionMethod;
	isSelected: boolean;
	toggleSelection: (_: ExpenseUser) => void;
	onChange: (_: string | number, __: DistributionMethod) => void;
}

const classes = stylesConfig(styles, "distribution-member");

const DistributionMember: React.FC<IDistributionMemberProps> = ({
	member,
	distributionMethod,
	isSelected,
	toggleSelection,
	onChange,
}) => {
	return (
		<div className={classes("")} key={`member-${member.id}`}>
			<CheckBox
				checked={isSelected}
				onChange={() => {
					toggleSelection(member);
				}}
			/>
			<Avatar
				src={member.avatar || fallbackAssets.avatar}
				alt={member.name || member.email}
				size={32}
			/>
			<Typography className={classes("-name")}>
				{member.name || member.email}
			</Typography>
			{distributionMethod === distributionMethods.equal ? (
				<EqualDistribution member={member} />
			) : distributionMethod === distributionMethods.percentage ? (
				<PercentageDistribution
					member={member}
					isSelected={isSelected}
					onChange={(value) =>
						onChange(value, distributionMethods.percentage)
					}
				/>
			) : distributionMethod === distributionMethods.fraction ? (
				<FractionDistribution
					member={member}
					isSelected={isSelected}
					onChange={(value) =>
						onChange(value, distributionMethods.fraction)
					}
				/>
			) : distributionMethod === distributionMethods.custom ? (
				<CustomDistribution
					member={member}
					isSelected={isSelected}
					onChange={(value) =>
						onChange(value, distributionMethods.custom)
					}
				/>
			) : null}
		</div>
	);
};

export default DistributionMember;
