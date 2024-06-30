import { Button } from "@/library";
import { stylesConfig } from "@/utils/functions";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FiLogIn } from "react-icons/fi";
import styles from "./styles.module.scss";

interface IHeaderProps {}

const classes = stylesConfig(styles, "header");

const Header: React.FC<IHeaderProps> = () => {
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
			className={classes("")}
			style={{
				translate: isNavbarVisible
					? "0"
					: "0 calc(-1 * var(--header-height))",
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
			<Button icon={<FiLogIn />}>Login</Button>
		</header>
	);
};

export default Header;
