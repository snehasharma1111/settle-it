import React from "react";
import styles from "./styles.module.scss";
import { stylesConfig } from "@/utils/functions";
import Avatar, { IAvatarProps } from ".";

const classes = stylesConfig(styles, "avatars");

interface IAvatarsProps extends Omit<IAvatarProps, "src" | "alt" | "children"> {
	children: Array<{ src: string; alt: string }>;
	stack?: boolean;
}

const Avatars: React.FC<IAvatarsProps> = ({
	children,
	stack = true,
	...props
}) => {
	return (
		<div
			className={classes("")}
			title={children.map((c) => c.alt).join(", ")}
		>
			{/* if there are more than 3, show only the first 3 and one more cell showing the count */}
			{children
				.slice(0, stack ? 3 : children.length)
				.map((child, index) => (
					<Avatar
						key={`avatars-${index}`}
						src={child.src}
						alt={child.alt}
						{...props}
						style={{
							marginLeft: stack
								? index === 0
									? 0
									: -(props.size || 50) / 3
								: index === 0
									? 0
									: 8,
							...props.style,
						}}
					/>
				))}
			{children.length > 3 ? (
				<Avatar
					src=""
					alt={`+${children.length - 3}`}
					size={props.size}
					style={{
						backgroundColor: "var(--theme-green)",
						color: "var(--theme-white)",
						marginLeft: stack ? -(props.size || 50) / 3 : 0,
						...props.style,
					}}
				/>
			) : null}
		</div>
	);
};

export default Avatars;
