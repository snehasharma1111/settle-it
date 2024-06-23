import React from "react";
import { stylesConfig } from "@/utils/functions";
import styles from "./styles.module.scss";
import { IBalance } from "@/types/member";
import { Typography } from "@/library";

interface IGroupSummaryProps {
	data: Array<IBalance>;
}

const classes = stylesConfig(styles, "group-summary");

const GroupSummary: React.FC<IGroupSummaryProps> = ({ data }) => {
	return (
		<div className={classes("")}>
			{data.map((balance, blId) => (
				<div
					className={classes("-person")}
					key={`group-summary-person-${blId}`}
				>
					<Typography size="md">
						{balance.user.name || balance.user.email}
						<span
							style={{
								color:
									balance.gives > 0
										? "var(--theme-red)"
										: "var(--theme-green)",
							}}
						>
							{balance.gives > 0
								? ` gives ${balance.gives.toFixed(2)}`
								: balance.gets > 0
									? ` gets ${balance.gets.toFixed(2)}`
									: null}{" "}
						</span>
						in total
					</Typography>
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
							{balance.user.name || balance.user.email}
							{transaction.gives > 0 ? (
								<>
									<span style={{ color: "var(--theme-red)" }}>
										{` gives ${transaction.gives.toFixed(2)}`}
									</span>{" "}
									to{" "}
									{transaction.user.name ||
										transaction.user.email}
								</>
							) : transaction.gets > 0 ? (
								<>
									<span
										style={{ color: "var(--theme-green)" }}
									>
										{` gets ${transaction.gets.toFixed(2)}`}
									</span>{" "}
									from{" "}
									{transaction.user.name ||
										transaction.user.email}
								</>
							) : null}
						</Typography>
					))}
				</div>
			))}
		</div>
	);
};

export default GroupSummary;
