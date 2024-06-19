import { fallbackAssets, routes } from "@/constants";
import { Avatars, Typography } from "@/library";
import { IGroup } from "@/types/group";
import { stylesConfig } from "@/utils/functions";
import Image from "next/image";
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
						<Image
							src={group.icon || fallbackAssets.groupIcon}
							alt={group.name}
							width={1920}
							height={1080}
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
						<button
							onClick={() => router.push(routes.GROUP(group.id))}
						>
							View Group Home
						</button>
					) : null}
					{router.pathname !== routes.GROUP_SUMMARY("[id]") ? (
						<button
							onClick={() =>
								router.push(routes.GROUP_SUMMARY(group.id))
							}
						>
							View summary
						</button>
					) : null}
					{router.pathname !== routes.GROUP_TRANSACTIONS("[id]") ? (
						<button
							onClick={() =>
								router.push(routes.GROUP_TRANSACTIONS(group.id))
							}
						>
							View all Transactions
						</button>
					) : null}
				</div>
			</section>
		</>
	);
};

export default GroupPageMeta;
