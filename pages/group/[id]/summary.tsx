import { GroupMetaData } from "@/components";
import { api } from "@/connections";
import { routes } from "@/constants";
import { useStore } from "@/hooks";
import { authMiddleware } from "@/middlewares";
import PageNotFound from "@/pages/404";
import styles from "@/styles/pages/Group.module.scss";
import { IGroup } from "@/types/group";
import { IBalance } from "@/types/member";
import { IUser } from "@/types/user";
import { stylesConfig } from "@/utils/functions";
import { getNonEmptyString } from "@/utils/safety";
import React, { useEffect, useState } from "react";

const classes = stylesConfig(styles, "group");

type GroupPageProps = {
	user: IUser;
	group: IGroup;
	expenditure: number;
	balances: Array<IBalance>;
};

const GroupPage: React.FC<GroupPageProps> = (props) => {
	const { setUser, dispatch, groups } = useStore();
	const [groupDetails, setGroupDetails] = useState<IGroup>(props.group);

	useEffect(() => {
		dispatch(setUser(props.user));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const group = groups.find((group) => group.id === props.group.id);
		if (group) setGroupDetails(group);
	}, [groups, props.group.id]);

	if (!props.group) return <PageNotFound />;

	return (
		<>
			<main className={classes("")}>
				<GroupMetaData group={groupDetails} />
				<section className={classes("-body")}>
					{props.balances.map((balance, index) => (
						<div key={index} className={classes("-body-row")}>
							<div className={classes("-body-row-label")}>
								{balance.user.name || balance.user.email}
							</div>
							<div className={classes("-body-row-value")}>
								{balance.owed > 0
									? `${balance.user.name || balance.user.email} owes ${balance.owed.toFixed(2)}`
									: null}
								{balance.paid > 0
									? `${balance.user.name || balance.user.email} paid ${balance.paid.toFixed(2)}`
									: null}
							</div>
							{balance.transactions.map((transaction, index) => (
								<div
									key={index}
									className={classes("-body-row-value")}
								>
									{transaction.owed > 0}
								</div>
							))}
						</div>
					))}
				</section>
			</main>
		</>
	);
};

export default GroupPage;

export const getServerSideProps = async (context: any) => {
	try {
		return await authMiddleware.page(context, {
			async onLoggedInAndOnboarded(user, headers) {
				const id = getNonEmptyString(context.query.id);
				const groupDetailsRes = await api.group.getBalances(
					id,
					headers
				);
				return {
					props: {
						user,
						...groupDetailsRes.data,
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
	} catch (error: any) {
		return {
			props: {
				error: error.message,
			},
		};
	}
};
