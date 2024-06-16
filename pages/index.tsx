import { routes } from "@/constants";
import { Typography } from "@/library";
import { authMiddleware } from "@/middlewares";
import styles from "@/styles/pages/Home.module.scss";
import { stylesConfig } from "@/utils/functions";
import React from "react";

const classes = stylesConfig(styles, "home");

const HomePage: React.FC = () => {
	return (
		<main className={classes("")}>
			<Typography size="head-1" as="h1" weight="semi-bold">
				Settle It
			</Typography>
			<Typography size="lg" as="p">
				Blend in the fun and let us handle your expenses.
			</Typography>
		</main>
	);
};

export default HomePage;

export const getServerSideProps = async (context: any) => {
	return await authMiddleware.page(context, {
		async onLoggedInAndOnboarded() {
			return {
				redirect: {
					destination: routes.HOME,
					permanent: false,
				},
			};
		},
		onLoggedInAndNotOnboarded() {
			return {
				redirect: {
					destination: routes.ONBOARDING,
					permanent: false,
				},
			};
		},
		onLoggedOut() {
			return {
				redirect: {
					destination: routes.LOGIN,
					permanent: false,
				},
			};
		},
	});
};
