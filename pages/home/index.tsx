import { api } from "@/connections";
import { fallbackAssets, routes } from "@/constants";
import { authMiddleware } from "@/middlewares";
import { IGroup } from "@/types/group";
import React, { useEffect } from "react";
import styles from "@/styles/pages/Home.module.scss";
import { stylesConfig } from "@/utils/functions";
import { Avatar, Avatars, Typography } from "@/library";
import { IUser } from "@/types/user";
import { useStore } from "@/hooks";
import { Responsive } from "@/layouts";
import Link from "next/link";

const classes = stylesConfig(styles, "home-page");

type HomePageProps = {
	user: IUser;
	groups: Array<IGroup>;
};

const HomePage: React.FC<HomePageProps> = (props) => {
	const { setUser, dispatch } = useStore();
	useEffect(() => {
		dispatch(setUser(props.user));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<main className={classes("")}>
			<header>
				<Typography size="head-4" as="h1" weight="medium">
					Good{" "}
					{new Date().getHours() < 12
						? "morning"
						: new Date().getHours() < 18
							? "afternoon"
							: new Date().getHours() < 24
								? "evening"
								: "night"}{" "}
					{props.user.name?.split(" ")[0]}
				</Typography>
				<button>
					<Avatar
						src={props.user.avatar || fallbackAssets.avatar}
						alt={props.user.name || "User"}
						size={48}
					/>
				</button>
			</header>
			<section className={classes("-groups")}>
				<Responsive.Row>
					{props.groups.map((group) => (
						<Responsive.Col
							key={group.id}
							xlg={25}
							lg={33}
							md={50}
							sm={100}
							xsm={100}
							style={{
								padding: "8px",
							}}
						>
							<Link
								className={classes("-group")}
								href={routes.GROUP(group.id)}
							>
								<Typography size="lg" as="h2" weight="medium">
									{group.name}
								</Typography>
								<Avatars size={36}>
									{group.members.map((member) => ({
										src:
											member.avatar ||
											fallbackAssets.avatar,
										alt: member.name || "User",
									}))}
								</Avatars>
							</Link>
						</Responsive.Col>
					))}
				</Responsive.Row>
			</section>
		</main>
	);
};

export default HomePage;

export const getServerSideProps = async (context: any) => {
	return await authMiddleware.page(context, {
		async onLoggedInAndOnboarded(user, headers) {
			const groupsRes = await api.group.getAllGroups(headers);
			return {
				props: {
					user,
					groups: groupsRes.data,
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
