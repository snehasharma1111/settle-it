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

/* export type IconButtonProps = Omit<
	IButtonProps,
	"children" | "iconPosition" | "loading" | "theme" | "variant"
>;
 */

export type IconButtonProps = React.DetailedHTMLProps<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
> & {
	className?: string;
	size?: "small" | "medium" | "large";
	icon: React.ReactNode;
};
