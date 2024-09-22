import { Typography } from "@/library";
import { stylesConfig } from "@/utils";
import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoSwapVerticalSharp } from "react-icons/io5";
import styles from "./styles.module.scss";

const classes = stylesConfig(styles);

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
	children: React.ReactNode;
}

interface TableContainerProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {
	children: React.ReactNode;
}

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
	children: React.ReactNode;
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
	children: React.ReactNode;
}

interface TableHeadCellProps
	extends React.HTMLAttributes<HTMLTableCellElement> {
	children: React.ReactNode;
	sortable?: boolean;
}

interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
	children:
		| React.ReactNode
		| string
		| number
		| boolean
		| React.ReactNode[]
		| any;
	isEditable?: boolean;
	onSave?: (_: any) => void;
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

interface TablePaginationProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
	label: string;
	currentPage: number;
	pageSize: number;
	count: number;
	totalPages: number;
	onChange: (_: { page: number; size: number }) => void;
	enableHideOnScroll?: boolean;
}

const TableContainer: React.FC<TableContainerProps> = ({
	children,
	className,
	...props
}) => {
	return (
		<div
			className={classes("table-container") + ` ${className}`}
			{...props}
		>
			{children}
		</div>
	);
};

const TableElement: React.FC<TableProps> = ({
	children,
	className,
	...props
}) => {
	return (
		<table className={classes("table") + ` ${className}`} {...props}>
			{children}
		</table>
	);
};

const TableHead: React.FC<TableHeadProps> = ({
	children,
	className,
	...props
}) => {
	return (
		<thead className={classes("table-head") + ` ${className}`} {...props}>
			{children}
		</thead>
	);
};

const TableBody: React.FC<TableBodyProps> = ({
	children,
	className,
	...props
}) => {
	return (
		<tbody className={classes("table-body") + ` ${className}`} {...props}>
			{children}
		</tbody>
	);
};

const TableRow: React.FC<TableRowProps> = ({
	children,
	className,
	...props
}) => {
	return (
		<tr className={classes("table-row") + ` ${className}`} {...props}>
			{children}
		</tr>
	);
};

const TableHeadCell: React.FC<TableHeadCellProps> = ({
	children,
	sortable,
	className,
	...props
}) => {
	return (
		<th
			className={
				classes("table-cell", "table-head-cell") + ` ${className}`
			}
			{...props}
			style={{
				cursor: sortable ? "pointer" : "default",
				...props.style,
			}}
		>
			{children}
			{sortable ? (
				<IoSwapVerticalSharp style={{ marginLeft: "16px" }} />
			) : null}
		</th>
	);
};

const TableCell: React.FC<TableCellProps> = ({
	children,
	isEditable,
	onSave,
	formatter,
	className,
	...props
}) => {
	return (
		<td
			className={classes("table-cell") + ` ${className}`}
			{...props}
			contentEditable={isEditable}
			onBlur={(e) => onSave && onSave(e.target.textContent)}
			data-gramm="false"
			data-gramm_editor="false"
			data-enable-grammarly="false"
			onKeyDown={(e: any) => {
				if (e.key === "Enter") {
					e.preventDefault();
					e.target.blur();
				}
			}}
		>
			{formatter === "text"
				? children
				: formatter === "number"
					? children
					: formatter === "date"
						? children
						: formatter === "time"
							? children
							: formatter === "boolean"
								? children
								: formatter === "link"
									? children
									: formatter === "image"
										? children
										: formatter === "custom"
											? children
											: children}
		</td>
	);
};

const TablePagination: React.FC<TablePaginationProps> = ({
	label,
	currentPage,
	pageSize,
	count,
	totalPages,
	onChange,
	enableHideOnScroll = false,
	...props
}) => {
	const lastScrollBottom = useRef<any>(0);
	const [isPaginationBarVisible, setIsPaginationBarVisible] = useState(false);

	const handleScroll = () => {
		const tableContainer: any = document.querySelector(
			`.${classes("table-container")}`
		);
		const tableContainerScrollTop = tableContainer?.scrollTop ?? 0;
		const tableContainerHeight = tableContainer?.offsetHeight ?? 0;
		const pageYOffset = tableContainerScrollTop + tableContainerHeight;
		if (pageYOffset > lastScrollBottom.current) {
			setIsPaginationBarVisible(true);
		} else if (pageYOffset < lastScrollBottom.current) {
			setIsPaginationBarVisible(false);
		}
		lastScrollBottom.current = pageYOffset;
	};

	const [page, setPage] = useState(currentPage);
	const [size, setSize] = useState(pageSize);

	const paginationBarRef = useRef<HTMLDivElement>(null);
	const sizesContainerRef = useRef<HTMLDivElement>(null);
	const totalCountRef = useRef<HTMLDivElement>(null);

	const handlePageChange = (page: number) => {
		setPage(page);
		onChange({ page, size });
	};

	const handleSizeChange = (size: number) => {
		setSize(size);
		if (Math.ceil(count / size) < page + 1) {
			setPage(0);
			onChange({ page: 0, size });
		} else {
			onChange({ page: 0, size });
		}
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll, {
			passive: true,
		});
		const tableContainer: any = document.querySelector(
			`.${classes("table-container")}`
		);
		tableContainer.addEventListener("scroll", handleScroll, {
			passive: true,
		});
		return () => window.removeEventListener("scroll", handleScroll);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div
			className={classes("table-pagination")}
			ref={paginationBarRef}
			style={{
				bottom: enableHideOnScroll
					? isPaginationBarVisible
						? 0
						: -(paginationBarRef.current?.offsetHeight ?? 0)
					: 0,
				...props.style,
			}}
			{...props}
		>
			<div
				className={classes("table-pagination__page-size")}
				ref={sizesContainerRef}
			>
				<label htmlFor="page-size">{`${label} per page`}</label>
				<div
					className={classes("table-pagination__page-size__selector")}
				>
					{[50, 100, 200].map((size, index) => (
						<button
							key={"page-size-" + index}
							onClick={() => handleSizeChange(size)}
							className={classes(
								"table-pagination__page-size__selector__size",
								{
									"table-pagination__page-size__selector__size--active":
										size === pageSize,
								}
							)}
						>
							<Typography size="head-1" weight="bold">
								{size}
							</Typography>
						</button>
					))}
				</div>
			</div>
			{totalPages > 0 ? (
				<div
					className={classes("table-pagination__selector")}
					style={{
						width: `calc(100% - ${
							(totalCountRef.current?.offsetWidth ?? 0) +
							(sizesContainerRef.current?.offsetWidth ?? 0) +
							48
						}px)`,
					}}
				>
					<button
						disabled={page === 0}
						onClick={() => handlePageChange(page - 1)}
						className={classes(
							"table-pagination__selector__button"
						)}
					>
						<IoIosArrowBack /> Prev
					</button>
					<div
						className={classes("table-pagination__selector__pages")}
					>
						{Array(totalPages)
							.fill(0)
							.map((_, i) => (
								<button
									key={i}
									disabled={page === i}
									onClick={() => handlePageChange(i)}
									className={classes(
										"table-pagination__selector__page",
										{
											"table-pagination__selector__page--active":
												page === i,
										}
									)}
								>
									<Typography size="lg" weight="medium">
										{i + 1}
									</Typography>
								</button>
							))}
					</div>
					<button
						disabled={page === totalPages - 1}
						onClick={() => handlePageChange(page + 1)}
						className={classes(
							"table-pagination__selector__button"
						)}
					>
						Next <IoIosArrowForward />
					</button>
				</div>
			) : null}
			<div
				className={classes("table-pagination__total")}
				ref={totalCountRef}
			>
				<Typography size="lg">{`Total ${label}: `}</Typography>
				<Typography size="lg">{count}</Typography>
			</div>
		</div>
	);
};

export const Table: {
	Container: React.FC<TableProps>;
	Element: React.FC<TableProps>;
	Head: React.FC<TableHeadProps>;
	Body: React.FC<TableBodyProps>;
	Row: React.FC<TableRowProps>;
	HeadCell: React.FC<TableHeadCellProps>;
	Cell: React.FC<TableCellProps>;
	Pagination: React.FC<TablePaginationProps>;
} = {
	Container: TableContainer,
	Element: TableElement,
	Head: TableHead,
	Body: TableBody,
	Row: TableRow,
	HeadCell: TableHeadCell,
	Cell: TableCell,
	Pagination: TablePagination,
};
