import { fallbackAssets, USER_STATUS } from "@/constants";
import { Avatar, Pane, Typography } from "@/library";
import { IGroup } from "@/types";
import { copyToClipboard, stylesConfig } from "@/utils";
import React from "react";
import { FiCopy, FiSettings, FiX } from "react-icons/fi";
import styles from "./styles.module.scss";

interface IGroupInfoProps {
	onClose: () => void;
	onUpdate?: () => void;
	group: IGroup;
}

const classes = stylesConfig(styles, "group-info");

const GroupInfo: React.FC<IGroupInfoProps> = ({ onClose, onUpdate, group }) => {
	const copyMembers = () => {
		const text = group.members
			.map((m) => `${m.name || m.email.split("@")[0]} <${m.email}>`)
			.join(", ");
		copyToClipboard(text);
	};
	return (
		<Pane
			onClose={onClose}
			title={group.name}
			className={classes("-parent")}
			showHeader={false}
			width={"40%"}
		>
			<div className={classes("")}>
				<div
					className={classes("-banner")}
					style={{
						backgroundImage: `url(${group.banner || fallbackAssets.banner})`,
					}}
				>
					<button
						onClick={onClose}
						className={classes("-banner-btn")}
					>
						<FiX />
					</button>
					{onUpdate ? (
						<button
							onClick={onUpdate}
							className={classes("-banner-btn")}
						>
							<FiSettings />
						</button>
					) : null}
				</div>
				<section className={classes("-main")}>
					<div className={classes("-details")}>
						<div className={classes("-icon")}>
							<Avatar
								src={group.icon || fallbackAssets.groupIcon}
								fallback={fallbackAssets.groupIcon}
								shape="square"
								alt={group.name}
								size={180}
							/>
						</div>
						<Typography size="xxxl" as="h2" weight="medium">
							{group.name}
						</Typography>
					</div>
					<div className={classes("-title")}>
						<Typography as="h2" size="xl" weight="medium">
							Members
						</Typography>
						<button onClick={copyMembers}>
							<FiCopy />
						</button>
					</div>
					<div className={classes("-members")}>
						{group.members.map((member) => (
							<div key={member.id} className={classes("-member")}>
								<Avatar
									src={member.avatar || fallbackAssets.avatar}
									alt={member.name || member.email}
									size={48}
								/>
								<Typography
									className={classes("-member-name")}
									size="lg"
								>
									{member.name || member.email}
								</Typography>
								<Typography
									size="s"
									className={classes("-member-chip", {
										"-member-chip--admin":
											group.createdBy.id === member.id,
										"-member-chip--invited":
											member.status ===
											USER_STATUS.INVITED,
									})}
								>
									{group.createdBy.id === member.id
										? "Group Admin"
										: member.status === USER_STATUS.INVITED
											? "Invited"
											: null}
								</Typography>
							</div>
						))}
					</div>
				</section>
			</div>
		</Pane>
	);
};

export default GroupInfo;
