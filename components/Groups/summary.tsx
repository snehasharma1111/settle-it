import { Avatar, Typography } from "@/library";
import { IBalance } from "@/types";
import { stylesConfig } from "@/utils";
import React from "react";
import styles from "./styles.module.scss";
import { fallbackAssets } from "@/constants";

interface IGroupSummaryProps {
	data: Array<IBalance>;
}

const classes = stylesConfig(styles, "group-summary");

const GroupSummary: React.FC<IGroupSummaryProps> = ({ data }) => {
	return (
		<div className={classes("")}>
			{data.map((balance, blId) => (
				<div
					className={classes("-person", "-person--block", {
						"-person--gives": balance.gives > 0,
						"-person--gets": balance.gets > 0,
					})}
					key={`group-summary-person-${blId}`}
				>
					<div className={classes("-person-details")}>
						<Avatar
							src={balance.user.avatar || fallbackAssets.avatar}
							alt={balance.user.name || balance.user.email}
							size={56}
						/>
						<div className={classes("-person-details__text")}>
							<Typography size="lg">
								{balance.user.name || balance.user.email}
							</Typography>
							<Typography size="s">
								{balance.gives > 0
									? `owes ${balance.gives.toFixed(2)} in total`
									: balance.gets > 0
										? `owes ${balance.gets.toFixed(2)} in total`
										: null}
							</Typography>
						</div>
					</div>
					{balance.transactions.map((transaction, trId) => (
						<Typography
							className={classes(
								"-person",
								"-person--sub",
								"-person--details"
							)}
							key={`group-summary-person-${trId}-transaction-${trId}`}
							size="sm"
						>
							{balance.gives > 0
								? `${balance.user.name || balance.user.email} gives ${transaction.gives.toFixed(2)} to ${transaction.user.name || transaction.user.email}`
								: balance.gets > 0
									? `${balance.user.name || balance.user.email} gets ${transaction.gets.toFixed(2)} from ${transaction.user.name || transaction.user.email}`
									: null}
						</Typography>
					))}
				</div>
			))}
		</div>
	);
};

export default GroupSummary;
