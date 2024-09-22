import { ConfirmationModal } from "@/components";
import { useState } from "react";

export const useConfirmationModal = (
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
