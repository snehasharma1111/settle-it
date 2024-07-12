import {
	CreateExpense,
	ExpenseCard,
	GroupMetaData,
	GroupPlaceholder,
	UpdateGroup,
	useConfirmationModal,
} from "@/components";
import { api } from "@/connections";
import { routes } from "@/constants";
import { useStore } from "@/hooks";
import { Responsive, Seo } from "@/layouts";
import { Button } from "@/library";
import { notify } from "@/messages";
import { authMiddleware } from "@/middlewares";
import PageNotFound from "@/pages/404";
import styles from "@/styles/pages/Group.module.scss";
import { CreateExpenseData, IExpense } from "@/types/expense";
import { IGroup, UpdateGroupData } from "@/types/group";
import { ServerSideResult } from "@/types/server";
import { IUser } from "@/types/user";
import { stylesConfig } from "@/utils/functions";
import { getNonEmptyString } from "@/utils/safety";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";

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
		deleteGroup,
		createExpense,
		groups,
		setGroups,
		expenses,
	} = useStore();
	const router = useRouter();
	const [openManageGroupPopup, setOpenManageGroupPopup] = useState(false);
	const [openAddExpensePopup, setOpenAddExpensePopup] = useState(false);
	const [updatingGroup, setUpdatingGroup] = useState(false);
	const [creatingExpense, setCreatingExpense] = useState(false);
	const [deletingExpense, setDeletingExpense] = useState(false);
	const [groupDetails, setGroupDetails] = useState<IGroup>(props.group);

	useEffect(() => {
		dispatch(setUser(props.user));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const group = groups.find((group) => group.id === props.group?.id);
		if (group) setGroupDetails(group);
		else {
			setGroupDetails(props.group);
			dispatch(setGroups([...groups, props.group]));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [groups]);

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

	const deleteGroupHelper = async () => {
		try {
			setDeletingExpense(true);
			const res = await dispatch(deleteGroup(groupDetails?.id)).unwrap();
			if (res) {
				router.push(routes.HOME);
			}
		} catch (error) {
			notify.error(error);
		} finally {
			setDeletingExpense(false);
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

	const deleteGroupConfirmation = useConfirmationModal(
		`Delete ${groupDetails?.name}?`,
		<>
			Are you sure you want to delete <b>{groupDetails?.name}</b> group?
			<br />
			This action cannot be undone
		</>,
		async () => {
			await deleteGroupHelper();
		},
		() => {
			deleteGroupConfirmation.closePopup();
		},
		deletingExpense
	);

	if (!props.group) return <PageNotFound />;

	return (
		<>
			<Seo title={`${groupDetails?.name} - Settle It`} />
			<main className={classes("")}>
				<GroupMetaData
					group={groupDetails}
					onUpdate={() => setOpenManageGroupPopup(true)}
				/>
				<section className={classes("-body")}>
					{expenses.filter((exp) => exp.group.id === groupDetails.id)
						.length === 0 ? (
						<GroupPlaceholder
							action={() => setOpenAddExpensePopup(true)}
						/>
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
										style={{
											height: "unset",
											flex: "0 1 auto",
											margin: "6px auto",
										}}
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
						size="large"
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
					onDelete={() => {
						setOpenManageGroupPopup(false);
						deleteGroupConfirmation.openPopup();
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
			{deleteGroupConfirmation.showPopup
				? deleteGroupConfirmation.Modal
				: null}
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
						`?redirect=/group/${context.query.id}`,
					permanent: false,
				},
			};
		},
		onLoggedOut() {
			return {
				redirect: {
					destination:
						routes.LOGIN + `?redirect=/group/${context.query.id}`,
					permanent: false,
				},
			};
		},
	});
};
