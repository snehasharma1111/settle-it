import { routes } from "@/constants";
import { Button } from "@/library";
import { stylesConfig } from "@/utils/functions";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { FiLogIn } from "react-icons/fi";
import styles from "./styles.module.scss";

interface IHeaderProps {}

const classes = stylesConfig(styles, "header");

const Header: React.FC<IHeaderProps> = () => {
	const router = useRouter();
	const lastScrollTop = useRef<any>(0);
	const [isNavbarVisible, setIsNavbarVisible] = useState(true);

	const handleScroll = () => {
		const { pageYOffset } = window;
		if (pageYOffset > lastScrollTop.current) setIsNavbarVisible(false);
		else if (pageYOffset < lastScrollTop.current) setIsNavbarVisible(true);
		lastScrollTop.current = pageYOffset;
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll, {
			passive: true,
		});
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	return (
		<header
			className={classes("", {
				"--visible": isNavbarVisible,
			})}
			style={{
				translate: isNavbarVisible
					? "0"
					: "0 calc(-1 * var(--head-height))",
			}}
		>
			<Link href="/">
				<Image
					className={classes("-logo")}
					src="/logo-full.png"
					alt="logo"
					width={512}
					height={512}
				/>
			</Link>
			<Button
				onClick={() => {
					router.push(routes.LOGIN);
				}}
				icon={<FiLogIn />}
			>
				Login
			</Button>
		</header>
	);
};

export default Header;
