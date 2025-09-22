import { adminPage } from "@/client";
import { AdminApi } from "@/connections";
import { routes } from "@/constants";
import { useHttpClient } from "@/hooks";
import { Seo } from "@/layouts";
import { Button, Table, Typography } from "@/library";
import styles from "@/styles/pages/Admin.module.scss";
import { IUser, ServerSideResult } from "@/types";
import { copyToClipboard, notify, stylesConfig } from "@/utils";
import React, { useEffect } from "react";

type AdminPanelCacheProps = {
	user: IUser;
};

const classes = stylesConfig(styles, "admin");

const AdminPanelCache: React.FC<AdminPanelCacheProps> = () => {
	const { data: cacheData, call: getData } = useHttpClient();
	const { loading: clearing, call: removeData } = useHttpClient();

	const clearCache = async () => {
		try {
			await Promise.all([
				removeData(AdminApi.clearCacheData),
				getData(AdminApi.getAllCacheData),
			]);
			notify.success("Cache cleared successfully.");
		} catch (error) {
			notify.error(error);
		}
	};

	useEffect(() => {
		getData(AdminApi.getAllCacheData);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return cacheData ? (
		<main className={classes("")}>
			<Seo
				title="Cache | Admin Panel"
				description="Cache management page of Admin Panel"
			/>
			<Typography size="xxl" weight="medium" as="h1">
				Cache Data ({Object.keys(cacheData).length})
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
						{Object.keys(cacheData).map((key, index) => (
							<Table.Row key={`admin-page-cache-${index}`}>
								<Table.Cell
									style={{
										maxWidth: "200px",
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis",
										verticalAlign: "top",
										padding: "2rem 1rem",
									}}
									title={key}
								>
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
										style={{
											maxHeight: "200px",
											overflowX: "hidden",
											overflowY: "auto",
											verticalAlign: "top",
											padding: "2rem 1rem",
										}}
										onClick={() =>
											copyToClipboard(
												JSON.stringify(
													cacheData[key],
													null,
													2
												)
											)
										}
									>
										{JSON.stringify(
											cacheData[key],
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
	return adminPage(context, {
		onAdmin(user) {
			return {
				props: { user },
			};
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
