import { useStore } from "@/hooks";
import { MaterialIcon, Typography } from "@/library";
import { Navigation } from "@/types";
import { stylesConfig } from "@/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "./styles.module.scss";

interface ISideBarProps {}

const classes = stylesConfig(styles, "side-bar");

const SideBarItem: React.FC<Navigation> = ({ title, icon, route, options }) => {
	const router = useRouter();
	const { isSidebarExpanded } = useStore();
	const [expanded, setExpanded] = useState(false);

	return (
		<>
			<li className={classes("-list__item")}>
				<Link
					href={route}
					className={classes("-link", {
						"-link--active": route === router.pathname,
					})}
				>
					{isSidebarExpanded && options && options.length > 0 ? (
						<button
							onClick={(e: any) => {
								e.preventDefault();
								e.stopPropagation();
								setExpanded((p) => !p);
							}}
							className={classes("-list__arrow", {
								"-list__arrow--expanded": expanded,
							})}
						>
							<MaterialIcon icon="arrow_right" />
						</button>
					) : null}
					<MaterialIcon
						className={classes("-link__icon")}
						icon={icon}
					/>
					<Typography className={classes("-link__title")} size="md">
						{title}
					</Typography>
				</Link>
			</li>
			{isSidebarExpanded && expanded && options && options.length > 0 ? (
				<ul className={classes("-list", "-sub-list")}>
					{options.map((option, index) => (
						<li
							className={classes(
								"-list__item",
								"-sub-list__item"
							)}
							key={index}
						>
							<Link
								href={option.route}
								className={classes("-link", "-sub-list__link", {
									"-link--active":
										option.route === router.asPath,
								})}
							>
								<MaterialIcon
									className={classes("-link__icon")}
									icon={option.icon}
								/>
								{option.title}
							</Link>
						</li>
					))}
				</ul>
			) : null}
		</>
	);
};

const SideBar: React.FC<ISideBarProps> = () => {
	const { closeSideBar, sideBarLinks, isSidebarExpanded } = useStore();
	return (
		<>
			<aside
				className={classes("", {
					"--expanded": isSidebarExpanded,
					"--collapsed": !isSidebarExpanded,
				})}
			>
				<nav className={classes("-nav")}>
					<ul className={classes("-list")}>
						{sideBarLinks.map((item, index) => (
							<SideBarItem key={index} {...item} />
						))}
					</ul>
				</nav>
			</aside>
			<div className={classes("-overlay")} onClick={closeSideBar} />
		</>
	);
};

export default SideBar;
