import React from "react";

export interface IAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
	src: string;
	alt: string;
	fallback?: string;
	shape?: "circle" | "square";
	className?: string;
	onClick?: () => void;
	isClickable?: boolean;
	size?: "small" | "medium" | "large" | number;
}
