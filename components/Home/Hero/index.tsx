import { routes } from "@/constants";
import { Button, Typography } from "@/library";
import { stylesConfig } from "@/utils/functions";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import styles from "./styles.module.scss";

interface IHomeHeroProps {}

const classes = stylesConfig(styles, "home-hero");

const HomeHero: React.FC<IHomeHeroProps> = () => {
	const router = useRouter();
	return (
		<section className={classes("")}>
			<div className={classes("-content")}>
				<Typography
					className={classes("-content__heading")}
					size="head-1"
					weight="bold"
				>
					Settle It ✨
				</Typography>
				<Typography
					className={classes("-content__subheading")}
					size="xl"
				>
					Blend in the fun and let us handle your expenses.
				</Typography>
				<Typography
					className={classes("-content__description")}
					size="s"
				>
					Settle It is a free, open source expense manager. You can
					track and manage your expenses with ease.
				</Typography>
				<Button
					size="large"
					icon={<AiOutlineArrowRight />}
					iconPosition="right"
					onClick={() => {
						router.push(routes.LOGIN);
					}}
				>
					Get Started Today
				</Button>
			</div>
			<Image
				src="/images/chaotic-parade.png"
				alt="chaotic-parade"
				width={1920}
				height={1080}
				className={classes("-image")}
			/>
		</section>
	);
};

export default HomeHero;
