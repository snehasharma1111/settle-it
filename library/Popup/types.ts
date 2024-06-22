import React from "react";

export interface PopupProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	title?: string;
	onClose: () => void;
	onEdit?: () => void;
	onDelete?: () => void;
	footer?: React.ReactNode;
	primaryAction?: any;
	secondaryAction?: any;
	showHeader?: boolean;
	showFooter?: boolean;
	width?: number | string;
	height?: number | string;
	style?: React.CSSProperties;
	loading?: boolean;
	styles?: {
		header?: React.CSSProperties;
		body?: React.CSSProperties;
		footer?: React.CSSProperties;
	};
}

export type IconProps = React.SVGProps<SVGSVGElement> & {};
