import { api } from "@/connections";
import { fallbackAssets, routes } from "@/constants";
import { useStore } from "@/hooks";
import { Button, Typography } from "@/library";
import { authMiddleware } from "@/middlewares";
import styles from "@/styles/pages/Group.module.scss";
import { IExpense } from "@/types/expenses";
import { IGroup } from "@/types/group";
import { IUser } from "@/types/user";
import { stylesConfig } from "@/utils/functions";
import { getNonEmptyString } from "@/utils/safety";
import Image from "next/image";
import React, { useEffect } from "react";

const classes = stylesConfig(styles, "group");

type GroupPageProps = {
	user: IUser;
	group: IGroup;
	expenses: Array<IExpense>;
};

const GroupPage: React.FC<GroupPageProps> = (props) => {
	const { setUser, dispatch } = useStore();
	useEffect(() => {
		dispatch(setUser(props.user));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<main className={classes("")}>
			<div
				className={classes("-banner")}
				style={{
					backgroundImage: `url(${props.group.banner || fallbackAssets.banner})`,
				}}
			/>
			<div className={classes("-meta")}>
				<div className={classes("-meta-icon")}>
					<Image
						src={props.group.icon || fallbackAssets.groupIcon}
						alt={props.group.name}
						width={1920}
						height={1080}
					/>
				</div>
				<Typography size="xl" as="h2" weight="medium">
					{props.group.name}
				</Typography>
			</div>
			<section className={classes("-body")}>
				{props.expenses.length === 0 ? (
					<div className={classes("-placeholder")}>
						<Image
							src="/vectors/empty-records.svg"
							alt="empty-records"
							width={1920}
							height={1080}
						/>
						<Typography>
							No expenses yet <br />
							Add one to get this party started
						</Typography>
						<Button>Add expense</Button>
					</div>
				) : null}
			</section>
		</main>
	);
};

export default GroupPage;

export const getServerSideProps = async (context: any) => {
	return await authMiddleware.page(context, {
		async onLoggedInAndOnboarded(user, headers) {
			const id = getNonEmptyString(context.query.id);
			const groupDetailsRes = await api.group.getGroupDetails(
				id,
				headers
			);
			return {
				props: {
					user,
					group: groupDetailsRes.data.group,
					expenses: groupDetailsRes.data.expenses,
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
