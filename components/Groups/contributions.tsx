import { useStore } from "@/hooks";
import { IShare } from "@/types";
import { stylesConfig } from "@/utils";
import React from "react";
import styles from "./styles.module.scss";
import { Typography } from "@/library";

interface IGroupContributionsProps {
	shares: Array<IShare>;
}

const classes = stylesConfig(styles, "group-contributions");

const GroupContributions: React.FC<IGroupContributionsProps> = ({ shares }) => {
	const { accentColor } = useStore();
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
		</div>
	);
};

export default GroupContributions;
