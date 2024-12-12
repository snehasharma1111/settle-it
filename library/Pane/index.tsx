import { Typography } from "@/library";
import { stylesConfig } from "@/utils";
import React, { useEffect, useRef, useState } from "react";
import { CloseIcon, EditIcon, TrashIcon } from "./assets";
import styles from "./styles.module.scss";
import { PaneProps } from "./types";

const classes = stylesConfig(styles, "modal-pane");

export const Pane: React.FC<PaneProps> = ({
	children,
	title,
	onClose,
	onEdit,
	onDelete,
	primaryAction,
	secondaryAction,
	showHeader = true,
	width = "60%",
	style,
	styles,
	loading = false,
	className,
	...props
}) => {
	const [isClosing, setIsClosing] = useState(false);
	const paneRef = useRef<HTMLDivElement>(null);

	const handleClose = () => {
		setIsClosing(true);
		setTimeout(() => {
			if (!loading) onClose && onClose();
		}, 300);
	};

	useEffect(() => {
		paneRef.current?.focus();
	}, []);

	return (
		<>
			<div
				className={
					classes("", {
						"--closing": isClosing,
					}) + ` ${className}`
				}
				style={{
					width: `min(95vw, ${width})`,
					...style,
				}}
				ref={paneRef}
				tabIndex={-1}
				onKeyDown={(e) => {
					if (e.key === "Escape") {
						handleClose();
					}
				}}
				{...props}
			>
				{showHeader ? (
					<div className={classes("-header")} style={styles?.header}>
						<Typography size="xl" weight="medium">
							{title}
						</Typography>
						<div className={classes("-header-actions")}>
							{secondaryAction ? secondaryAction : null}
							{primaryAction ? primaryAction : null}
							{onEdit ? (
								<button
									className={classes("-header-edit")}
									onClick={onEdit}
								>
									<EditIcon />
								</button>
							) : null}
							{onDelete ? (
								<button
									className={classes("-header-delete")}
									onClick={onDelete}
								>
									<TrashIcon />
								</button>
							) : null}
							<button
								className={classes("-header-close")}
								onClick={handleClose}
							>
								<CloseIcon />
							</button>
						</div>
					</div>
				) : null}
				{children ? (
					<div className={classes("-body")}>{children}</div>
				) : null}
			</div>
			<div className={classes("-overlay")} onClick={handleClose}></div>
		</>
	);
};
