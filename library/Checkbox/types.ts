import React from "react";

export interface CheckboxProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: any;
	className?: string;
	checked?: boolean;
	onChange?: any;
	disabled?: boolean;
}
