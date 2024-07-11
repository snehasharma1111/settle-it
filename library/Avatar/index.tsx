import { fallbackAssets, regex } from "@/constants";
import { stylesConfig } from "@/utils/functions";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Avatars from "./multiple";
import styles from "./styles.module.scss";

export interface IAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
	src: string;
	alt: string;
	className?: string;
	onClick?: () => void;
	size?: "small" | "medium" | "large" | number;
}

const classes = stylesConfig(styles);

const Avatar: React.FC<IAvatarProps> = ({
	src,
	alt,
	className,
	onClick,
	size = "medium",
	...props
}) => {
	const [isImageValid, setIsImageValid] = useState(
		src && regex.avatar.test(src) ? true : false
	);
	const [imageUrl, setImageUrl] = useState(
		src && regex.avatar.test(src) ? src : ""
	);

	const getAvatarSize = () => {
		switch (size) {
			case "small":
				return 100;
			case "medium":
				return 150;
			case "large":
				return 200;
			default:
				return typeof size === "number" ? size : 50;
		}
	};

	const getImageUrlFromDriveLink = (link: string) => {
		// eslint-disable-next-line no-useless-escape
		const regex = /^https:\/\/drive\.google\.com\/file\/d\/([^\/]+)(\/|$)/;
		const match = link.match(regex);
		if (match && match[1]) {
			const assetUrl = `https://lh3.googleusercontent.com/d/${match[1]}=w1000`;
			return assetUrl;
		} else {
			return link;
		}
	};

	useEffect(() => {
		setIsImageValid(src && regex.avatar.test(src) ? true : false);
		setImageUrl(getImageUrlFromDriveLink(src));
	}, [src]);

	return (
		<div
			className={classes("avatar") + ` ${className ?? ""}`}
			onClick={onClick}
			title={alt}
			{...props}
			style={{
				width: getAvatarSize(),
				height: getAvatarSize(),
				cursor:
					onClick && typeof onClick === "function"
						? "pointer"
						: "auto",
				...props.style,
			}}
		>
			{isImageValid ? (
				<Image
					src={imageUrl}
					alt={alt + ""}
					width={getAvatarSize() * 2}
					height={getAvatarSize() * 2}
					className={classes("avatar-image")}
					onError={() => {
						setIsImageValid(false);
					}}
				/>
			) : (
				<Image
					src={fallbackAssets.avatar}
					alt={alt + ""}
					width={getAvatarSize() * 2}
					height={getAvatarSize() * 2}
					className={classes("avatar-image")}
				/>
			)}
		</div>
	);
};

export default Avatar;
export { Avatars };
