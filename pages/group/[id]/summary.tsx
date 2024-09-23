import {
	GroupMetaData,
	GroupPlaceholder,
	GroupSummary,
	Loader,
	OwedRecords,
} from "@/components";
import { api } from "@/connections";
import { routes } from "@/constants";
import { useHttpClient, useStore } from "@/hooks";
import { Seo } from "@/layouts";
import { Typography } from "@/library";
import { notify } from "@/messages";
import { authMiddleware } from "@/middlewares";
import PageNotFound from "@/pages/404";
import styles from "@/styles/pages/Group.module.scss";
import { IBalancesSummary, IGroup, IUser, ServerSideResult } from "@/types";
import { getNonEmptyString, stylesConfig } from "@/utils";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const classes = stylesConfig(styles, "group");

type GroupPageProps = {
	user: IUser;
	group: IGroup;
};

const GroupPage: React.FC<GroupPageProps> = (props) => {
	const { setUser, dispatch, groups } = useStore();
	const router = useRouter();
	const client = useHttpClient();
	const [groupDetails, setGroupDetails] = useState<IGroup>(props.group);
	const [uncollapsedGroup, setUncollapsedGroup] = useState<
		"owed" | "summary" | null
	>(null);
	const [expenditure, setExpenditure] = useState(0);
	const [balances, setBalances] = useState<IBalancesSummary>({
		owes: [],
		balances: [],
	});

	const getGroupSummaryHelper = async () => {
		try {
			client.updateId("get-summary");
			const fetchedSummary = await client.call(
				api.group.getBalancesSummary,
				props.group.id
			);
			setBalances(fetchedSummary.balances);
			setExpenditure(fetchedSummary.expenditure);
			if (fetchedSummary.balances.owes.length > 0) {
				setUncollapsedGroup("owed");
			} else {
				setUncollapsedGroup("summary");
			}
		} catch (error) {
			notify.error(error);
		}
	};

	const handleGroupCollapse = (group: "owed" | "summary") => {
		if (uncollapsedGroup === group) setUncollapsedGroup(null);
		else setUncollapsedGroup(group);
	};

	useEffect(() => {
		dispatch(setUser(props.user));
		getGroupSummaryHelper();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const group = groups.find((group) => group.id === props.group.id);
		if (group) setGroupDetails(group);
	}, [groups, props.group?.id]);

	if (!props.group)
		return <PageNotFound description={(props as any).error} />;

	return (
		<main className={classes("")}>
			<Seo title={`${groupDetails?.name} - Summary | Settle It`} />
			<GroupMetaData group={groupDetails} />
			{client.loading ? (
				<section className={classes("-body", "-body--center")}>
					<Loader.Spinner />
				</section>
			) : balances.owes.length === 0 && balances.balances.length === 0 ? (
				<GroupPlaceholder
					action={() => router.push(routes.GROUP(groupDetails.id))}
				/>
			) : (
				<section className={classes("-body")}>
					<Typography size="xl" weight="medium">
						Total Expenditure: {expenditure.toFixed(2)}
					</Typography>
					<div
						className={classes("-head", {
							"-head--uncollapsed": uncollapsedGroup === "owed",
						})}
						onClick={() => handleGroupCollapse("owed")}
					>
						<Typography size="lg">Owed Amount</Typography>
						<hr />
						<button onClick={() => handleGroupCollapse("owed")}>
							<FiChevronDown />
						</button>
					</div>
					{uncollapsedGroup === "owed" ? (
						<OwedRecords
							groupId={props.group?.id}
							data={balances.owes}
						/>
					) : null}
					<div
						className={classes("-head", {
							"-head--uncollapsed":
								uncollapsedGroup === "summary",
						})}
					>
						<Typography size="lg">Summary</Typography>
						<hr />
						<button onClick={() => handleGroupCollapse("summary")}>
							<FiChevronDown />
						</button>
					</div>
					{uncollapsedGroup === "summary" ? (
						<GroupSummary data={balances.balances} />
					) : null}
				</section>
			)}
		</main>
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
				const { data } = await api.group.getGroupDetails(id, headers);
				return {
					props: {
						user,
						group: data,
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
						`?redirect=/group/${context.query.id}/summary`,
					permanent: false,
				},
			};
		},
		onLoggedOut() {
			return {
				redirect: {
					destination:
						routes.LOGIN +
						`?redirect=/group/${context.query.id}/summary`,
					permanent: false,
				},
			};
		},
	});
};
