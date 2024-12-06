import { stylesConfig } from "@/utils";
import React, { forwardRef } from "react";
import styles from "./styles.module.scss";
import { ButtonSize, ButtonTheme, ButtonVariant, IButtonProps } from "./types";

const classNames = stylesConfig(styles);

const BUTON_SIZES: Record<ButtonSize, string> = {
	small: "btn--size--small",
	medium: "btn--size--medium",
	large: "btn--size--large",
};

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
	filled: "btn--variant--filled",
	outlined: "btn--variant--outlined",
	text: "btn--variant--text",
};

const BUTTON_THEMES: Record<ButtonTheme, string> = {
	default: "btn--theme--default",
	success: "btn--theme--success",
	error: "btn--theme--error",
	warning: "btn--theme--warning",
	info: "btn--theme--info",
};

const Button: React.ForwardRefRenderFunction<
	HTMLButtonElement,
	IButtonProps
> = (
	{
		children,
		className,
		variant = "filled",
		theme = "default",
		size = "medium",
		loading = false,
		icon,
		iconPosition = "left",
		...props
	},
	ref
) => {
	return (
		<button
			className={[
				classNames(
					"btn",
					BUTON_SIZES[size],
					BUTTON_VARIANTS[variant],
					BUTTON_THEMES[theme],
					{ "btn--loading": loading },
					{ "btn--disabled": props.disabled || loading }
				),
				className,
			].join(" ")}
			disabled={props.disabled || loading}
			ref={ref}
			{...props}
		>
			{loading ? (
				<div className={classNames("btn__loader")}></div>
			) : (
				<>
					{icon && iconPosition === "left" ? (
						<div
							className={classNames(
								"btn__icon",
								"btn__icon--left"
							)}
						>
							{icon}
						</div>
					) : null}
					{children}
					{icon && iconPosition === "right" ? (
						<div
							className={classNames(
								"btn__icon",
								"btn__icon--right"
							)}
						>
							{icon}
						</div>
					) : null}
				</>
			)}
		</button>
	);
};

export default forwardRef<HTMLButtonElement, IButtonProps>(Button);
