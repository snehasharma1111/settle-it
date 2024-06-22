import React from "react";

export interface IButtonProps
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	children: React.ReactNode;
	className?: string;
	variant?: "filled" | "outlined" | "text";
	theme?: "success" | "error" | "warning" | "info";
	size?: "small" | "medium" | "large";
	loading?: boolean;
	icon?: React.ReactNode;
	iconPosition?: "left" | "right";
}
