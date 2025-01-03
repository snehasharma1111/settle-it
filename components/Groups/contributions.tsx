import { fallbackAssets } from "@/constants";
import { useStore } from "@/hooks";
import { Avatar, Typography } from "@/library";
import { IShare } from "@/types";
import { stylesConfig } from "@/utils";
import React from "react";
import styles from "./styles.module.scss";

interface IGroupContributionsProps {
	shares: Array<IShare>;
}

const classes = stylesConfig(styles, "group-contributions");

const GroupContributions: React.FC<IGroupContributionsProps> = ({ shares }) => {
	const { accentColor, theme } = useStore();
	return (
		<div className={classes("")}>
			<div className={classes("-bar")}>
				{shares.map((share) => (
					<div
						className={classes("-bar__item")}
						key={`group-contributions-bar-${share.user.id}`}
						style={{
							width: `${share.percentage}%`,
							backgroundColor: `rgba(${accentColor}, ${share.opacity})`,
						}}
					>
						<div className={classes("-bar__item--user")}>
							<Typography
								className={classes("-bar__item--user__name")}
								size="s"
							>
								{share.user.name ||
									share.user.email.slice(0, 7)}
							</Typography>
							<Typography
								className={classes("-bar__item--user__share")}
								size="xs"
							>
								{share.percentage}%
							</Typography>
						</div>
					</div>
				))}
			</div>
			<div className={classes("-cards")}>
				{shares.map((record, recId) => (
					<div
						key={`owed-record-person-${recId}`}
						className={classes("-person", "-person--block")}
						style={{
							backgroundColor: `rgba(${accentColor}, ${record.opacity})`,
						}}
					>
						<div
							className={classes("-person-details")}
							style={{
								color:
									record.opacity > 0.5 || theme === "dark"
										? "var(--theme-white)"
										: "var(--theme-black)",
							}}
						>
							<Avatar
								src={
									record.user.avatar || fallbackAssets.avatar
								}
								alt={record.user.name || record.user.email}
								size={56}
							/>
							<div className={classes("-person-details__text")}>
								<Typography size="lg">
									{record.user.name || record.user.email}
								</Typography>
								<Typography size="s">
									{record.percentage.toFixed(2)}%
								</Typography>
								<Typography size="s">
									{new Intl.NumberFormat("en-US", {
										style: "currency",
										currency: "INR",
									}).format(record.amount)}
								</Typography>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default GroupContributions;
