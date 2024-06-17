import { CreateExpense, UpdateGroup } from "@/components";
import { api } from "@/connections";
import { fallbackAssets, routes } from "@/constants";
import { useStore } from "@/hooks";
import { Responsive } from "@/layouts";
import { Avatars, Button, Typography } from "@/library";
import { notify } from "@/messages";
import { authMiddleware } from "@/middlewares";
import PageNotFound from "@/pages/404";
import styles from "@/styles/pages/Group.module.scss";
import { CreateExpenseData } from "@/types/expense";
import { IExpense } from "@/types/expenses";
import { IGroup, UpdateGroupData } from "@/types/group";
import { IUser } from "@/types/user";
import { stylesConfig } from "@/utils/functions";
import { getNonEmptyString } from "@/utils/safety";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FiSettings } from "react-icons/fi";

const classes = stylesConfig(styles, "group");

type GroupPageProps = {
	user: IUser;
	group: IGroup;
	expenses: Array<IExpense>;
};

const GroupPage: React.FC<GroupPageProps> = (props) => {
	const {
		setUser,
		dispatch,
		updateGroup,
		createExpense,
		groups,
		user: loggedInUser,
	} = useStore();
	const [openManageGroupPopup, setOpenManageGroupPopup] = useState(false);
	const [openAddExpensePopup, setOpenAddExpensePopup] = useState(false);
	const [updatingGroup, setUpdatingGroup] = useState(false);
	const [creatingExpense, setCreatingExpense] = useState(false);
	const [groupDetails, setGroupDetails] = useState<IGroup>(props.group);

	useEffect(() => {
		dispatch(setUser(props.user));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const group = groups.find((group) => group.id === props.group.id);
		if (group) setGroupDetails(group);
	}, [groups, props.group.id]);

	const updateGroupHelper = async (
		id: string,
		updatedGroupData: UpdateGroupData
	) => {
		try {
			setUpdatingGroup(true);
			const res = await dispatch(
				updateGroup({ id, data: updatedGroupData })
			);
			if (res) {
				setOpenManageGroupPopup(false);
			}
		} catch (error) {
			notify.error(error);
		} finally {
			setUpdatingGroup(false);
		}
	};

	const createExpenseHelper = async (data: CreateExpenseData) => {
		try {
			setCreatingExpense(true);
			const res = await dispatch(createExpense(data));
			if (res) {
				setOpenAddExpensePopup(false);
			}
		} catch (error) {
			notify.error(error);
		} finally {
			setCreatingExpense(false);
		}
	};

	if (!props.group) return <PageNotFound />;

	return (
		<>
			<main className={classes("")}>
				<div
					className={classes("-banner")}
					style={{
						backgroundImage: `url(${groupDetails.banner || fallbackAssets.banner})`,
					}}
				>
					<button onClick={() => setOpenManageGroupPopup(true)}>
						<FiSettings />
					</button>
				</div>
				<div className={classes("-meta")}>
					<div className={classes("-meta-icon")}>
						<Image
							src={groupDetails.icon || fallbackAssets.groupIcon}
							alt={groupDetails.name}
							width={1920}
							height={1080}
						/>
					</div>
					<Typography size="xxl" as="h2" weight="medium">
						{groupDetails.name}
					</Typography>
					<Avatars size={32}>
						{groupDetails.members.map((member) => ({
							src: member.avatar || fallbackAssets.avatar,
							alt: member.name || "avatar",
						}))}
					</Avatars>
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
							<Button
								onClick={() => setOpenAddExpensePopup(true)}
							>
								Add expense
							</Button>
						</div>
					) : (
						<Responsive.Row>
							{props.expenses.map((expense) => (
								<Responsive.Col key={`expense-${expense.id}`}>
									<div className={classes("-expense")}>
										<Typography>
											{moment(expense.createdAt).format(
												"MMM DD, YYYY"
											)}
										</Typography>
										<Typography>{expense.title}</Typography>
										<Typography>
											{expense.paidBy.name} paid{" "}
											{expense.amount}
										</Typography>
									</div>
								</Responsive.Col>
							))}
						</Responsive.Row>
					)}
				</section>
			</main>
			{openManageGroupPopup ? (
				<UpdateGroup
					id={groupDetails.id}
					onClose={() => setOpenManageGroupPopup(false)}
					onSave={(updatedGroupData) => {
						updateGroupHelper(groupDetails.id, updatedGroupData);
					}}
					loading={updatingGroup}
				/>
			) : null}
			{openAddExpensePopup ? (
				<CreateExpense
					groupId={groupDetails.id}
					onClose={() => setOpenAddExpensePopup(false)}
					onSave={createExpenseHelper}
					loading={creatingExpense}
				/>
			) : null}
		</>
	);
};

export default GroupPage;

export const getServerSideProps = async (context: any) => {
	try {
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
	} catch (error: any) {
		return {
			props: {
				error: error.message,
			},
		};
	}
};
