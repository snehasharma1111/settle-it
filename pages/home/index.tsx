import { CreateGroup, Header } from "@/components";
import { api } from "@/connections";
import { fallbackAssets, routes } from "@/constants";
import { useStore } from "@/hooks";
import { Responsive } from "@/layouts";
import { Avatars, Button, Typography } from "@/library";
import { notify } from "@/messages";
import { authMiddleware } from "@/middlewares";
import styles from "@/styles/pages/Home.module.scss";
import { CreateGroupData, IGroup } from "@/types/group";
import { IUser } from "@/types/user";
import { stylesConfig } from "@/utils/functions";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const classes = stylesConfig(styles, "home-page");

type HomePageProps = {
	user: IUser;
	groups: Array<IGroup>;
};

const HomePage: React.FC<HomePageProps> = (props) => {
	const { setUser, setGroups, dispatch, createGroup, groups } = useStore();
	const [openCreateGroupPopup, setOpenCreateGroupPopup] = useState(false);
	const [creatingGroup, setCreatingGroup] = useState(false);

	useEffect(() => {
		dispatch(setUser(props.user));
		dispatch(setGroups(props.groups));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const createGroupHelper = async (newGroupData: CreateGroupData) => {
		try {
			setCreatingGroup(true);
			const res = await dispatch(createGroup(newGroupData));
			if (res) {
				setOpenCreateGroupPopup(false);
			}
		} catch (error) {
			notify.error(error);
		} finally {
			setCreatingGroup(false);
		}
	};

	return (
		<>
			<Header />
			<main className={classes("")}>
				{groups.length > 0 ? (
					<Responsive.Row>
						{groups.map((group) => (
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
									<Image
										src={
											group.icon ||
											fallbackAssets.groupIcon
										}
										alt={group.name}
										width={1920}
										height={1080}
									/>
									<div>
										<Typography
											size="xl"
											as="h2"
											weight="medium"
										>
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
									</div>
								</Link>
							</Responsive.Col>
						))}
					</Responsive.Row>
				) : (
					<div className={classes("-placeholder")}>
						<Image
							src="/vectors/empty-records.svg"
							alt="empty-records"
							width={1920}
							height={1080}
						/>
						<Typography>
							You&apos;re not part of any groups yet.
							<br />
							Plan a trip or an outing to get started.
						</Typography>
						<Button onClick={() => setOpenCreateGroupPopup(true)}>
							Create Group
						</Button>
					</div>
				)}
			</main>
			{openCreateGroupPopup ? (
				<CreateGroup
					loading={creatingGroup}
					onClose={() => setOpenCreateGroupPopup(false)}
					onSave={createGroupHelper}
				/>
			) : null}
		</>
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
