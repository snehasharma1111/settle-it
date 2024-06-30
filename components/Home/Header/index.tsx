import { fallbackAssets } from "@/constants";
import { useStore } from "@/hooks";
import { Avatar, Typography } from "@/library";
import { stylesConfig } from "@/utils/functions";
import React from "react";
import styles from "./styles.module.scss";
import { useRouter } from "next/router";

interface IHeaderProps {}

const classes = stylesConfig(styles, "header");

const Header: React.FC<IHeaderProps> = () => {
	const { user } = useStore();
	const router = useRouter();
	if (!user.id) return null;
	return (
		<header className={classes("")}>
			<Typography size="head-4" as="h1" weight="medium">
				Good{" "}
				{new Date().getHours() < 12
					? "Morning"
					: new Date().getHours() < 18
						? "Afternoon"
						: new Date().getHours() < 24
							? "Evening"
							: "Night"}{" "}
				{user.name?.split(" ")[0]}
			</Typography>
			<button>
				<Avatar
					src={user.avatar || fallbackAssets.avatar}
					alt={user.name || "User"}
					size={48}
					onClick={() => router.push("/me")}
				/>
			</button>
		</header>
	);
};

export default Header;
