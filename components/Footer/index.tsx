import { socials } from "@/constants";
import { stylesConfig } from "@/utils";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import styles from "./styles.module.scss";

const classes = stylesConfig(styles, "footer");

const Footer: React.FC = () => {
	const router = useRouter();
	return (
		<footer className={classes("")}>
			<div className={classes("-top")}>
				<div className={classes("-logo")}>
					<Image
						src="/logo-full.png"
						alt="Settle It"
						onClick={() => {
							router.push("/");
						}}
						width={1920}
						height={1080}
					/>
				</div>
			</div>
			<hr className={classes("-divider")} />
			<div className={classes("-base")}>
				<ul className={classes("-socials")}>
					{socials.map((social) => (
						<li key={social.name}>
							<a
								href={social.href}
								target="_blank"
								rel="noreferrer"
								aria-label={social.name}
							>
								{social.icon}
							</a>
						</li>
					))}
				</ul>
				<div className={classes("-copyright")}>
					<p>
						© {new Date().getFullYear()} Settle It. All rights
						reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
