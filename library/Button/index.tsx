import React, { forwardRef } from "react";
import { IButtonProps } from "./types";
import { stylesConfig } from "@/utils/functions";
import styles from "./styles.module.scss";

const classNames = stylesConfig(styles);

const BUTON_SIZES: { [key: string]: string } = {
	small: "btn--size--small",
	medium: "btn--size--medium",
	large: "btn--size--large",
};

const BUTTON_VARIANTS: { [key: string]: string } = {
	filled: "btn--variant--filled",
	outlined: "btn--variant--outlined",
	text: "btn--variant--text",
};

const BUTTON_THEMES: { [key: string]: string } = {
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
		theme = "success",
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
