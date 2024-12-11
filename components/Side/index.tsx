import { useStore } from "@/hooks";
import { MaterialIcon, Typography } from "@/library";
import { stylesConfig } from "@/utils/functions";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styles from "./styles.module.scss";

interface ISideBarProps {}

const classes = stylesConfig(styles, "side-bar");

const SideBar: React.FC<ISideBarProps> = () => {
	const router = useRouter();
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
							<li className={classes("-list__item")} key={index}>
								<Link
									href={item.route}
									className={classes("-link", {
										"-link--active":
											item.route === router.pathname,
									})}
								>
									<MaterialIcon icon={item.icon} />
									<Typography
										className={classes("-link__title")}
										size="md"
									>
										{item.title}
									</Typography>
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</aside>
			<div className={classes("-overlay")} onClick={closeSideBar} />
		</>
	);
};

export default SideBar;
