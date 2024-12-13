import { MemberApi } from "@/connections";
import { useStore } from "@/hooks";
import { Button, Typography } from "@/library";
import { IOwedRecord } from "@/types";
import { notify, stylesConfig } from "@/utils";
import React, { useState } from "react";
import styles from "./styles.module.scss";

interface IGroupOwedDataProps {
	groupId: string;
	data: Array<IOwedRecord>;
}

interface GroupOwedDataPersonProps {
	groupId: string;
	record: IOwedRecord;
	transaction: Omit<IOwedRecord, "transactions">;
	onUpdate: (_: Array<IOwedRecord>) => void;
}

const classes = stylesConfig(styles, "group-owed-data");

const GroupOwedDataPerson: React.FC<GroupOwedDataPersonProps> = ({
	groupId,
	record,
	transaction,
	onUpdate,
}) => {
	const { user: loggedInUser } = useStore();
	const [settling, setSettling] = useState(false);
	const settleTwoUsers = async (userA: string, userB: string) => {
		try {
			setSettling(true);
			const res = await MemberApi.settleOwedMembersInGroup(
				groupId,
				userA,
				userB
			);
			onUpdate(res.data);
		} catch (error) {
			notify.error(error);
		} finally {
			setSettling(false);
		}
	};
	return (
		<div className={classes("-person", "-person--sub")}>
			<Typography
				size="sm"
				className={classes("-person", "-person--details")}
			>
				{record.user.name || record.user.email}
				<span style={{ color: "var(--theme-red)" }}>
					owes {transaction.amount.toFixed(2)}
				</span>
				to {transaction.user.name || transaction.user.email}
			</Typography>
			{transaction.user.id === loggedInUser.id ? (
				<Button
					size="small"
					loading={settling}
					onClick={() => {
						settleTwoUsers(record.user.id, transaction.user.id);
					}}
				>
					Settle
				</Button>
			) : null}
		</div>
	);
};

const GroupOwedData: React.FC<IGroupOwedDataProps> = ({
	groupId,
	data: originalData,
}) => {
	const [data, setData] = useState<IOwedRecord[]>(originalData);

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
						<GroupOwedDataPerson
							key={`owed-record-person-${recId}-transaction-${trId}`}
							groupId={groupId}
							record={record}
							transaction={tr}
							onUpdate={(updatedData) => setData(updatedData)}
						/>
					))}
				</div>
			))}
		</div>
	);
};

export default GroupOwedData;
