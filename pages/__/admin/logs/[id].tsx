import { adminPage } from "@/client";
import { AdminApi } from "@/connections";
import { routes } from "@/constants";
import { Button, Typography } from "@/library";
import styles from "@/styles/pages/Admin.module.scss";
import { IUser, ServerSideResult } from "@/types";
import {
	getNonEmptyString,
	getNonNullValue,
	safeParse,
	saveFile,
	stylesConfig,
} from "@/utils";
import React from "react";
import { FiDownload } from "react-icons/fi";

type AdminPanelLogPageProps = {
	user: IUser;
	file: string;
	content: string;
};

const classes = stylesConfig(styles, "admin");

const AdminPanelLogPage: React.FC<AdminPanelLogPageProps> = (props) => {
	return props.content ? (
		<main className={classes("")}>
			<Typography size="xxl" weight="medium" as="h1">
				Logs for {props.file}
			</Typography>
			<Button
				onClick={() => {
					saveFile(props.content, props.file, "log");
				}}
				icon={<FiDownload />}
			>
				Download file
			</Button>
			<pre style={{ width: "100%", overflowX: "auto" }}>
				{props.content}
			</pre>
		</main>
	) : (
		"No logs found"
	);
};

export default AdminPanelLogPage;

export const getServerSideProps = (
	context: any
): Promise<ServerSideResult<AdminPanelLogPageProps>> => {
	return adminPage(context, {
		async onAdmin(user, headers) {
			try {
				// const fileName = context.query.id as string;
				const fileName = getNonNullValue(
					safeParse(getNonEmptyString, context.query.id)
				);
				const res = await AdminApi.getLogFileByName(fileName, headers);
				return {
					props: {
						user,
						file: fileName,
						content: res.data,
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
					destination: routes.LOGIN + `?redirect=${routes.LOGS}`,
					permanent: false,
				},
			};
		},
	});
};
