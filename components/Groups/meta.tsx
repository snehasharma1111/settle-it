import { fallbackAssets, routes } from "@/constants";
import { Avatar, Avatars, Button, Typography } from "@/library";
import { IGroup } from "@/types";
import { stylesConfig } from "@/utils";
import { useRouter } from "next/router";
import React from "react";
import { FiArrowLeft, FiList, FiSettings } from "react-icons/fi";
import styles from "./styles.module.scss";

interface IGroupPageMetaProps {
	group: IGroup;
	onUpdate?: () => void;
}

const classes = stylesConfig(styles, "group-meta");

const GroupPageMeta: React.FC<IGroupPageMetaProps> = ({ group, onUpdate }) => {
	const router = useRouter();
	return (
		<>
			<div
				className={classes("-banner")}
				style={{
					backgroundImage: `url(${group.banner || fallbackAssets.banner})`,
				}}
			>
				<button
					onClick={() => router.push(routes.HOME)}
					className={classes("-banner-btn")}
				>
					<FiArrowLeft />
				</button>
				{router.pathname === "/group/[id]" ? (
					<button
						onClick={onUpdate}
						className={classes("-banner-btn")}
					>
						<FiSettings />
					</button>
				) : (
					<button
						onClick={() => router.push(routes.GROUP(group.id))}
						className={classes("-banner-btn")}
					>
						<FiList />
					</button>
				)}
			</div>
			<section className={classes("")}>
				<div className={classes("-details")}>
					<div className={classes("-icon")}>
						<Avatar
							src={group.icon || fallbackAssets.groupIcon}
							fallback={fallbackAssets.groupIcon}
							shape="square"
							alt={group.name}
							size={80}
						/>
					</div>
					<Typography size="xxl" as="h2" weight="medium">
						{group.name}
					</Typography>
					<Avatars size={32}>
						{group.members.map((member) => ({
							src: member.avatar || fallbackAssets.avatar,
							alt: member.name || member.email,
						}))}
					</Avatars>
				</div>
				<div className={classes("-actions")}>
					{router.pathname !== routes.GROUP("[id]") ? (
						<Button
							onClick={() => router.push(routes.GROUP(group.id))}
							theme="info"
						>
							View Group Home
						</Button>
					) : null}
					{router.pathname !== routes.GROUP_SUMMARY("[id]") ? (
						<Button
							onClick={() =>
								router.push(routes.GROUP_SUMMARY(group.id))
							}
							theme="info"
						>
							View summary
						</Button>
					) : null}
					{router.pathname !== routes.GROUP_TRANSACTIONS("[id]") ? (
						<Button
							onClick={() =>
								router.push(routes.GROUP_TRANSACTIONS(group.id))
							}
							theme="info"
						>
							View all Transactions
						</Button>
					) : null}
				</div>
			</section>
		</>
	);
};

export default GroupPageMeta;
