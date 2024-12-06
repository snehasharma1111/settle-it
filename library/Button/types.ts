import React from "react";

export type ButtonVariant = "filled" | "outlined" | "text";
export type ButtonTheme = "default" | "success" | "error" | "warning" | "info";
export type ButtonSize = "small" | "medium" | "large";

export interface IButtonProps
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	children: React.ReactNode;
	className?: string;
	variant?: ButtonVariant;
	theme?: ButtonTheme;
	size?: ButtonSize;
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
	size?: ButtonSize;
	icon: React.ReactNode;
};
