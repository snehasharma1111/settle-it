import React from "react";

export interface ITableField {
	id: string;
	path: string;
	label: string;
	align?: "left" | "right" | "center";
	isEditable?: boolean;
	sortable?: boolean;
	hidden?: boolean;
}

export interface IOldTableHeadField {
	id: string;
	key: string;
	label: string;
	tooltip?: (_: any) => string;
	align?: "left" | "right" | "center" | "justify";
	sortable?: boolean;
	sortDirection?: "asc" | "desc";
	comparator?: (_: any, __: any) => number;
	validator?: (_: any) => boolean;
	showCopy?: boolean;
	copyValue?: (_: any) => string | number | boolean;
	width?: number;
	minWidth?: number;
	maxWidth?: number;
	hidden?: boolean;
	isEditable?: boolean;
	style?: React.CSSProperties;
	fallback?:
		| string
		| number
		| boolean
		| React.ReactNode
		| ((_: any) => string | number | boolean | React.ReactNode);
	formatter?:
		| "text"
		| "number"
		| "date"
		| "time"
		| "score"
		| "skills"
		| "boolean"
		| "link"
		| "image"
		| "custom"
		| ((_: any) => string | number | boolean | React.ReactNode);
}
