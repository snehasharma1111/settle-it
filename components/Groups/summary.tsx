import { Avatar, Typography } from "@/library";
import { IBalance } from "@/types";
import { getUserDetails, stylesConfig } from "@/utils";
import React from "react";
import styles from "./styles.module.scss";

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
							src={getUserDetails(balance.user).avatar || ""}
							alt={getUserDetails(balance.user).name || ""}
							size={56}
						/>
						<div className={classes("-person-details__text")}>
							<Typography size="lg">
								{getUserDetails(balance.user).name || ""}
							</Typography>
							<Typography size="s">
								{balance.gives > 0
									? `gives ${balance.gives.toFixed(2)} in total`
									: balance.gets > 0
										? `gets ${balance.gets.toFixed(2)} in total`
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
								? `${getUserDetails(balance.user).name} gives ${transaction.gives.toFixed(2)} to ${getUserDetails(transaction.user).name}`
								: balance.gets > 0
									? `${getUserDetails(balance.user).name} gets ${transaction.gets.toFixed(2)} from ${getUserDetails(transaction.user).name}`
									: null}
						</Typography>
					))}
				</div>
			))}
		</div>
	);
};

export default GroupSummary;
