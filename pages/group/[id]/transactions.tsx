import { GroupMetaData } from "@/components";
import { api } from "@/connections";
import { routes } from "@/constants";
import { useStore } from "@/hooks";
import { authMiddleware } from "@/middlewares";
import PageNotFound from "@/pages/404";
import styles from "@/styles/pages/Group.module.scss";
import { IGroup } from "@/types/group";
import { ITransaction } from "@/types/member";
import { IUser } from "@/types/user";
import { stylesConfig } from "@/utils/functions";
import { getNonEmptyString } from "@/utils/safety";
import React, { useEffect, useState } from "react";

const classes = stylesConfig(styles, "group");

type GroupPageProps = {
	user: IUser;
	group: IGroup;
	expenditure: number;
	transactions: Array<ITransaction>;
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
				<section className={classes("-body", "-body--table")}>
					<table border={1}>
						<thead>
							<tr>
								<th>S. No.</th>
								<th>Title</th>
								<th>From</th>
								<th>To</th>
								<th>Amount</th>
								<th>Settled</th>
							</tr>
						</thead>
						<tbody>
							{props.transactions.map((transaction, index) => (
								<tr key={`transaction-${index}`}>
									<td>{index + 1}</td>
									<td>{transaction.title}</td>
									<td>
										{transaction.from.name ||
											transaction.from.email}
									</td>
									<td>
										{transaction.to.name ||
											transaction.to.email}
									</td>
									<td>
										{transaction.owed > 0
											? transaction.owed
											: transaction.paid}
									</td>
									<td>
										{transaction.owed === 0
											? "Yes ✅"
											: "No ❌"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
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
				const groupDetailsRes = await api.group.getTransactions(
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
