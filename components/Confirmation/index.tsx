import { Button, Popup, Typography } from "@/library";
import { stylesConfig } from "@/utils/functions";
import React, { useState } from "react";
import styles from "./styles.module.scss";

interface ConfirmationModalProps {
	title: string;
	body: any;
	onConfirm: () => any | Promise<any>;
	onCancel: () => void;
	loading?: boolean;
}

const classes = stylesConfig(styles, "confirmation-modal");

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
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

export default ConfirmationModal;

const useConfirmationModal = (
	title: string,
	body: any,
	onConfirm: any,
	onCancel: any,
	loading?: boolean
) => {
	const [showPopup, setShowPopup] = useState(false);

	const openPopup = () => setShowPopup(true);
	const closePopup = () => setShowPopup(false);

	const Modal = (
		<ConfirmationModal
			title={title}
			body={body}
			loading={loading}
			onConfirm={async () => {
				await onConfirm();
				closePopup();
			}}
			onCancel={() => {
				onCancel();
				closePopup();
			}}
		/>
	);
	return { openPopup, closePopup, showPopup, Modal };
};

export { useConfirmationModal };
