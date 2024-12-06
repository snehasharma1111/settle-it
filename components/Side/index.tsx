import { useStore } from "@/hooks";
import { MaterialIcon, Typography } from "@/library";
import { stylesConfig } from "@/utils/functions";
import Link from "next/link";
import React from "react";
import styles from "./styles.module.scss";

interface ISideBarProps {}

const classes = stylesConfig(styles, "side-bar");

const SideBar: React.FC<ISideBarProps> = () => {
	const { closeSideBar, sideBarLinks } = useStore();
	return (
		<section className={classes("")}>
			<div
				className={classes("-overlay")}
				onClick={() => closeSideBar()}
			></div>
			<aside className={classes("-bar")} data-aos="fade-right">
				<nav className={classes("-nav")}>
					<ul className={classes("-list")}>
						{sideBarLinks.map((item, index) => (
							<li className={classes("-list__item")} key={index}>
								<Link
									href={item.route}
									className={classes("-link")}
								>
									<MaterialIcon icon={item.icon} />
									<Typography size="lg">
										{item.title}
									</Typography>
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</aside>
		</section>
	);
};

export default SideBar;
