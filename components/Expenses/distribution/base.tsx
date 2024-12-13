import { Input, Typography } from "@/library";
import { logger } from "@/log";
import { IUser } from "@/types";
import { runningCase, stylesConfig } from "@/utils";
import React, { useEffect, useState } from "react";
import { DistributionMethod, distributionMethods, ExpenseUser } from "./assets";
import Member from "./member";
import styles from "./styles.module.scss";
import { getAmount, getFormattedValue } from "./utils";

interface IDistributionsBaseProps {
	totalAmount: number;
	members: Array<ExpenseUser>;
	setMembers: (_: Array<ExpenseUser>) => void;
}

const classes = stylesConfig(styles, "distribution");

export const DistributionsBase: React.FC<IDistributionsBaseProps> = ({
	totalAmount,
	members,
	setMembers,
}) => {
	const [membersCount, setMembersCount] = useState(members.length);
	const [method, setMethod] = useState<DistributionMethod>(
		distributionMethods.equal
	);

	const handleSelectUser = (member: ExpenseUser) => {
		const presentState = member.selected;
		const finalCount = presentState ? membersCount - 1 : membersCount + 1;
		const newMembers = [...members].map((user) => {
			if (method === distributionMethods.equal) {
				if (user.id === member.id) {
					user.selected = !presentState;
				}
				if (user.selected) {
					const newAmount = getAmount(
						member.value,
						method,
						finalCount,
						totalAmount
					);
					const newValue = getFormattedValue(
						newAmount,
						method,
						finalCount,
						totalAmount
					);
					return {
						...user,
						amount: newAmount,
						value: newValue,
					};
				} else {
					return {
						...user,
						amount: 0,
						value: getFormattedValue(
							0,
							method,
							finalCount,
							totalAmount
						),
					};
				}
			}
			if (user.id === member.id) {
				const presentState = user.selected;
				if (presentState) {
					const newValue = getFormattedValue(
						0,
						method,
						membersCount,
						totalAmount
					);
					logger.debug("new value after deselection", newValue);
					return {
						...user,
						selected: false,
						amount: 0,
						value: newValue,
					};
				} else {
					return {
						...user,
						selected: true,
					};
				}
			}
			return user;
		});
		setMembers(newMembers);
		setMembersCount(finalCount);
	};

	const handleMethodChange = (newMethod: DistributionMethod) => {
		const oldMethod = method;
		logger.debug(oldMethod, newMethod);
		const newMembers = members.map((member) => {
			if (newMethod === distributionMethods.equal) {
				if (member.selected) {
					const newAmount = getAmount(
						member.value,
						newMethod,
						membersCount,
						totalAmount
					);
					const newValue = getFormattedValue(
						newAmount,
						newMethod,
						membersCount,
						totalAmount
					);
					return {
						...member,
						amount: newAmount,
						value: newValue,
					};
				} else {
					return {
						...member,
						amount: 0,
						value: getFormattedValue(
							0,
							newMethod,
							membersCount,
							totalAmount
						),
					};
				}
			}
			const value = member.value;
			logger.debug(value);
			const amount = member.selected
				? getAmount(value, oldMethod, membersCount, totalAmount)
				: 0;
			const newValue = getFormattedValue(
				amount,
				newMethod,
				membersCount,
				totalAmount
			);
			logger.debug(amount, newValue);
			return {
				...member,
				value: newValue,
				amount,
			};
		});
		setMethod(newMethod);
		setMembers(newMembers);
	};

	const handleValueChange = (
		value: string | number,
		method: DistributionMethod,
		member: IUser
	) => {
		const amount = getAmount(value, method, membersCount, totalAmount);
		const newValue = getFormattedValue(
			amount,
			method,
			membersCount,
			totalAmount
		);
		logger.debug(amount, newValue);
		const newMembers = members.map((m) => {
			if (!m.selected) return m;
			if (m.id === member.id) {
				return {
					...m,
					value,
					amount,
				};
			}
			return m;
		});
		setMembers(newMembers);
	};

	useEffect(() => {
		handleMethodChange(method);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [totalAmount]);

	return (
		<div className={classes("")}>
			<div className={classes("-header")}>
				<Typography>Split Balance</Typography>
				<Input
					placeholder="Equal"
					value={runningCase(method)}
					dropdown={{
						enabled: true,
						options: Object.values(distributionMethods).map(
							(method, index) => ({
								id: `distribution-method-option-${index}`,
								value: method,
								label: runningCase(method),
							})
						),
						onSelect: (option) => {
							handleMethodChange(
								option.value as DistributionMethod
							);
						},
					}}
				/>
			</div>
			<div className={classes("-members")}>
				{members.map((member) => (
					<Member
						key={`member-${member.id}`}
						member={member}
						distributionMethod={method}
						isSelected={
							members.find((user) => user.id === member.id)!
								.selected
						}
						toggleSelection={handleSelectUser}
						onChange={(
							value: string | number,
							method: DistributionMethod
						) => {
							handleValueChange(value, method, member);
						}}
					/>
				))}
			</div>
		</div>
	);
};
