import { api } from "@/connections";
import { routes } from "@/constants";
import { useStore } from "@/hooks";
import { Seo } from "@/layouts";
import { Button, Table, Typography } from "@/library";
import { notify } from "@/messages";
import { adminMiddleware } from "@/middlewares";
import styles from "@/styles/pages/Admin.module.scss";
import { ServerSideResult } from "@/types/server";
import { IUser } from "@/types/user";
import { copyToClipboard, stylesConfig } from "@/utils/functions";
import React, { useEffect, useState } from "react";

type AdminPanelCacheProps = {
	user: IUser;
	cacheData: any;
};

const classes = stylesConfig(styles, "admin");

const AdminPanelCache: React.FC<AdminPanelCacheProps> = (props) => {
	const { user, setUser, dispatch } = useStore();
	const [clearing, setClearing] = useState(false);

	const clearCache = async () => {
		try {
			setClearing(true);
			await api.admin.clearCacheData();
			notify.success("Cache cleared successfully.");
		} catch (error) {
			notify.error(error);
		} finally {
			setClearing(false);
		}
	};

	useEffect(() => {
		if (!user) dispatch(setUser(props.user));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return props.cacheData ? (
		<main className={classes("")}>
			<Seo
				title="Cache | Admin Panel"
				description="Cache management page of Admin Panel"
			/>
			<Typography size="xxl" weight="medium" as="h1">
				Cache Data ({Object.keys(props.cacheData).length})
			</Typography>
			<Button onClick={clearCache} loading={clearing}>
				Clear Cache
			</Button>
			<Table.Container>
				<Table.Element>
					<Table.Head>
						<Table.Row>
							<Table.HeadCell>
								<Typography size="lg" weight="medium">
									Key
								</Typography>
							</Table.HeadCell>
							<Table.HeadCell>
								<Typography size="lg" weight="medium">
									Value
								</Typography>
							</Table.HeadCell>
						</Table.Row>
					</Table.Head>
					<Table.Body>
						{Object.keys(props.cacheData).map((key, index) => (
							<Table.Row key={`admin-page-cache-${index}`}>
								<Table.Cell>
									<Typography
										size="md"
										weight="medium"
										onClick={() => copyToClipboard(key)}
									>
										{key}
									</Typography>
								</Table.Cell>
								<Table.Cell>
									<Typography
										size="md"
										as="pre"
										onClick={() =>
											copyToClipboard(
												JSON.stringify(
													props.cacheData[key],
													null,
													2
												)
											)
										}
									>
										{JSON.stringify(
											props.cacheData[key],
											null,
											2
										)}
									</Typography>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Element>
			</Table.Container>
		</main>
	) : (
		"No cache data available"
	);
};

export default AdminPanelCache;

export const getServerSideProps = (
	context: any
): Promise<ServerSideResult<AdminPanelCacheProps>> => {
	return adminMiddleware.page(context, {
		async onAdmin(user, headers) {
			try {
				const cacheRes = await api.admin.getAllCacheData(headers);
				return {
					props: {
						user,
						cacheData: cacheRes.data,
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
		onNonAdmin() {
			return {
				redirect: {
					destination: routes.HOME,
					permanent: false,
				},
			};
		},
		onLoggedOut() {
			return {
				redirect: {
					destination: routes.LOGIN + "?redirect=/__/admin",
					permanent: false,
				},
			};
		},
	});
};
