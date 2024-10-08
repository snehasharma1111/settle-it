import { authenticatedPage } from "@/client";
import { Home } from "@/components";
import { routes } from "@/constants";
import styles from "@/styles/pages/Home.module.scss";
import { ServerSideResult } from "@/types";
import { stylesConfig } from "@/utils";
import React from "react";

const classes = stylesConfig(styles, "home");

const HomePage: React.FC = () => {
	return (
		<main className={classes("")}>
			<Home.Hero />
		</main>
	);
};

export default HomePage;

export const getServerSideProps = (context: any): Promise<ServerSideResult> => {
	return authenticatedPage(context, {
		onLoggedInAndOnboarded() {
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
				props: {},
			};
		},
	});
};
