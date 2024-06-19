import {
	CreateExpense,
	ExpenseCard,
	GroupMetaData,
	UpdateGroup,
} from "@/components";
import { api } from "@/connections";
import { routes } from "@/constants";
import { useStore } from "@/hooks";
import { Responsive } from "@/layouts";
import { Button, Typography } from "@/library";
import { notify } from "@/messages";
import { authMiddleware } from "@/middlewares";
import PageNotFound from "@/pages/404";
import styles from "@/styles/pages/Group.module.scss";
import { CreateExpenseData, IExpense } from "@/types/expense";
import { IGroup, UpdateGroupData } from "@/types/group";
import { IUser } from "@/types/user";
import { stylesConfig } from "@/utils/functions";
import { getNonEmptyString } from "@/utils/safety";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";

const classes = stylesConfig(styles, "group");

type GroupPageProps = {
	user: IUser;
	group: IGroup;
	expenses: Array<IExpense>;
};

const GroupPage: React.FC<GroupPageProps> = (props) => {
	const { setUser, dispatch, updateGroup, createExpense, groups, expenses } =
		useStore();
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
			).unwrap();
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
				<GroupMetaData
					group={groupDetails}
					onUpdate={() => setOpenManageGroupPopup(true)}
				/>
				<section className={classes("-body")}>
					{expenses.filter((exp) => exp.group.id === groupDetails.id)
						.length === 0 ? (
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
							{expenses
								.filter(
									(exp) => exp.group.id === groupDetails.id
								)
								.map((expense) => (
									<Responsive.Col
										key={`expense-${expense.id}`}
										xlg={25}
										lg={33}
										md={50}
										sm={50}
										xsm={100}
									>
										<ExpenseCard {...expense} />
									</Responsive.Col>
								))}
						</Responsive.Row>
					)}
				</section>
				{expenses.filter((exp) => exp.group.id === groupDetails.id)
					.length > 0 ? (
					<Button
						onClick={() => setOpenAddExpensePopup(true)}
						className={classes("-add-fab")}
					>
						<FiPlus /> Add expense
					</Button>
				) : null}
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
