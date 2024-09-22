import { Typography } from "@/library";
import { stylesConfig } from "@/utils";
import React, { useEffect, useRef, useState } from "react";
import { CloseIcon, EditIcon, TrashIcon } from "./assets";
import styles from "./styles.module.scss";
import { PopupProps } from "./types";

const classes = stylesConfig(styles, "modal-popup");

export const Popup: React.FC<PopupProps> = ({
	children,
	title,
	onClose,
	onEdit,
	onDelete,
	footer,
	primaryAction,
	secondaryAction,
	showHeader = true,
	showFooter = true,
	width = "60%",
	height = "60%",
	style,
	styles,
	loading = false,
	className,
	...props
}) => {
	const [isClosing, setIsClosing] = useState(false);
	const popupRef = useRef<HTMLDivElement>(null);

	const handleClose = () => {
		setIsClosing(true);
		setTimeout(() => {
			if (!loading) onClose && onClose();
		}, 300);
	};

	useEffect(() => {
		popupRef.current?.focus();
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
					height: `min(95vh, ${height})`,
					justifyContent: showFooter ? "space-between" : "flex-start",
					...style,
				}}
				ref={popupRef}
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
				{showFooter && (primaryAction || secondaryAction || footer) ? (
					<div
						className={classes("-footer")}
						style={{
							justifyContent:
								footer && (primaryAction || secondaryAction)
									? "space-between"
									: footer
										? "flex-start"
										: primaryAction || secondaryAction
											? "flex-end"
											: "flex-start",
							...styles?.footer,
						}}
					>
						{footer && (primaryAction || secondaryAction) ? (
							<>
								<div className={classes("-footer-left")}>
									{footer}
								</div>
								<div className={classes("-footer-right")}>
									{secondaryAction}
									{primaryAction}
								</div>
							</>
						) : (
							<>
								{footer ? footer : null}
								{secondaryAction ? secondaryAction : null}
								{primaryAction ? primaryAction : null}
							</>
						)}
					</div>
				) : null}
			</div>
			<div className={classes("-overlay")} onClick={handleClose}></div>
		</>
	);
};
