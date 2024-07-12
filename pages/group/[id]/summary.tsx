import {
	GroupMetaData,
	GroupPlaceholder,
	GroupSummary,
	OwedRecords,
} from "@/components";
import { api } from "@/connections";
import { routes } from "@/constants";
import { useStore } from "@/hooks";
import { Seo } from "@/layouts";
import { Typography } from "@/library";
import { authMiddleware } from "@/middlewares";
import PageNotFound from "@/pages/404";
import styles from "@/styles/pages/Group.module.scss";
import { IGroup } from "@/types/group";
import { IBalancesSummary } from "@/types/member";
import { ServerSideResult } from "@/types/server";
import { IUser } from "@/types/user";
import { stylesConfig } from "@/utils/functions";
import { getNonEmptyString } from "@/utils/safety";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const classes = stylesConfig(styles, "group");

type GroupPageProps = {
	user: IUser;
	group: IGroup;
	expenditure: number;
	balances: IBalancesSummary;
};

const GroupPage: React.FC<GroupPageProps> = (props) => {
	const { setUser, dispatch, groups } = useStore();
	const router = useRouter();
	const [groupDetails, setGroupDetails] = useState<IGroup>(props.group);
	const [uncollapsedGroup, setUncollapsedGroup] = useState<
		"owed" | "summary" | null
	>("summary");

	const handleGroupCollapse = (group: "owed" | "summary") => {
		if (uncollapsedGroup === group) setUncollapsedGroup(null);
		else setUncollapsedGroup(group);
	};

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
			<Seo title={`${groupDetails?.name} - Summary | Settle It`} />
			<main className={classes("")}>
				<GroupMetaData group={groupDetails} />
				{props.balances.owes.length === 0 &&
				props.balances.balances.length === 0 ? (
					<GroupPlaceholder
						action={() =>
							router.push(routes.GROUP(groupDetails.id))
						}
					/>
				) : (
					<section className={classes("-body")}>
						<Typography size="xl" weight="medium">
							Total Expenditure: {props.expenditure.toFixed(2)}
						</Typography>
						<div
							className={classes("-head", {
								"-head--uncollapsed":
									uncollapsedGroup === "owed",
							})}
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
								data={props.balances.owes}
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
							<button
								onClick={() => handleGroupCollapse("summary")}
							>
								<FiChevronDown />
							</button>
						</div>
						{uncollapsedGroup === "summary" ? (
							<GroupSummary data={props.balances.balances} />
						) : null}
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
				const groupDetailsRes = await api.group.getBalancesSummary(
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
