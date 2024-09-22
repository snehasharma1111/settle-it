import { GroupMetaData, GroupPlaceholder } from "@/components";
import { api } from "@/connections";
import { routes } from "@/constants";
import { useStore } from "@/hooks";
import { Seo } from "@/layouts";
import { authMiddleware } from "@/middlewares";
import PageNotFound from "@/pages/404";
import styles from "@/styles/pages/Group.module.scss";
import { IGroup, ITransaction, IUser, ServerSideResult } from "@/types";
import { getNonEmptyString, stylesConfig } from "@/utils";
import { useRouter } from "next/router";
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
	const router = useRouter();
	const [groupDetails, setGroupDetails] = useState<IGroup>(props.group);

	useEffect(() => {
		dispatch(setUser(props.user));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const group = groups.find((group) => group.id === props.group.id);
		if (group) setGroupDetails(group);
	}, [groups, props.group?.id]);

	if (!props.group)
		return <PageNotFound description={(props as any).error} />;

	return (
		<>
			<Seo title={`${groupDetails?.name} - Transactions | Settle It`} />
			<main className={classes("")}>
				<GroupMetaData group={groupDetails} />
				{props.transactions.length === 0 ? (
					<GroupPlaceholder
						action={() =>
							router.push(routes.GROUP(groupDetails.id))
						}
					/>
				) : (
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
								{props.transactions.map(
									(transaction, index) => (
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
									)
								)}
							</tbody>
						</table>
					</section>
				)}
			</main>
		</>
	);
};

export default GroupPage;

export const getServerSideProps = (
	context: any
): Promise<ServerSideResult<GroupPageProps>> => {
	return authMiddleware.page(context, {
		async onLoggedInAndOnboarded(user, headers) {
			try {
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
			} catch (error: any) {
				return {
					props: {
						error: error.message,
					},
				};
			}
		},
		onLoggedInAndNotOnboarded() {
			return {
				redirect: {
					destination:
						routes.ONBOARDING +
						`?redirect=/group/${context.query.id}/transactions`,
					permanent: false,
				},
			};
		},
		onLoggedOut() {
			return {
				redirect: {
					destination:
						routes.LOGIN +
						`?redirect=/group/${context.query.id}/transactions`,
					permanent: false,
				},
			};
		},
	});
};
