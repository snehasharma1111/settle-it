import { stylesConfig } from "@/utils";
import React from "react";
import { CheckboxChecked, CheckboxEmpty } from "./assets";
import styles from "./styles.module.scss";
import { CheckboxProps } from "./types";

const classes = stylesConfig(styles, "form-checkbox");

export const CheckBox: React.FC<CheckboxProps> = ({
	label,
	className,
	checked,
	onChange,
	disabled,
	...rest
}) => {
	return (
		<label
			className={[
				classes("", {
					"-checked": checked ? true : false,
					"-disabled": disabled ? true : false,
				}),
				className,
			].join(" ")}
		>
			<input
				type="checkbox"
				className={classes("-input")}
				checked={checked}
				onChange={onChange}
				disabled={disabled}
				{...rest}
			/>
			{checked ? <CheckboxChecked /> : <CheckboxEmpty />}
			{label ? <span className={classes("-label")}>{label}</span> : null}
		</label>
	);
};
