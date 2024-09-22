import { Button, Popup, Typography } from "@/library";
import { stylesConfig } from "@/utils";
import React from "react";
import styles from "./styles.module.scss";

interface ConfirmationModalProps {
	title: string;
	body: any;
	onConfirm: () => any | Promise<any>;
	onCancel: () => void;
	loading?: boolean;
}

const classes = stylesConfig(styles, "confirmation-modal");

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
	title,
	body,
	onConfirm,
	onCancel,
	loading = false,
}) => {
	return (
		<Popup
			title={title}
			onClose={onCancel}
			width="600px"
			height="250px"
			secondaryAction={
				<Button variant="outlined" onClick={onCancel}>
					Cancel
				</Button>
			}
			primaryAction={
				<Button loading={loading} variant="filled" onClick={onConfirm}>
					Confirm
				</Button>
			}
		>
			<Typography size="s" className={classes("-body")}>
				{body}
			</Typography>
		</Popup>
	);
};
