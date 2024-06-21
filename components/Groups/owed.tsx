import { Typography } from "@/library";
import { IOwedRecord } from "@/types/member";
import { stylesConfig } from "@/utils/functions";
import React from "react";
import styles from "./styles.module.scss";

interface IGroupOwedDataProps {
	data: Array<IOwedRecord>;
}

const classes = stylesConfig(styles, "group-owed-data");

const GroupOwedData: React.FC<IGroupOwedDataProps> = ({ data }) => {
	return (
		<div className={classes("")}>
			{data.map((record, recId) => (
				<div
					key={`owed-record-person-${recId}`}
					className={classes("-person")}
				>
					<Typography size="md">
						{record.user.name || record.user.email}{" "}
						<span style={{ color: "var(--theme-red)" }}>
							owes {record.amount.toFixed(2)}{" "}
						</span>
						in total
					</Typography>
					{record.transactions.map((tr, trId) => (
						<Typography
							className={classes("-person", "-person--sub")}
							key={`owed-record-person-${recId}-transaction-${trId}`}
							size="sm"
						>
							{record.user.name || record.user.email}
							<span style={{ color: "var(--theme-red)" }}>
								owes {tr.amount.toFixed(2)}
							</span>
							to {tr.user.name || tr.user.email}
						</Typography>
					))}
				</div>
			))}
		</div>
	);
};

export default GroupOwedData;
