import React from "react";
import { IconProps } from "./types";

export const CloseIcon: React.FC<IconProps> = ({ ...props }) => (
	<svg
		{...props}
		xmlns="http://www.w3.org/2000/svg"
		height="24px"
		viewBox="0 -960 960 960"
		width="24px"
		fill="#5f6368"
	>
		<path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
	</svg>
);

export const EditIcon: React.FC<IconProps> = ({ ...props }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 48 48"
		width="48px"
		height="48px"
		{...props}
	>
		<linearGradient
			id="SVGID_1_"
			x1="40.178"
			x2="6.212"
			y1="7.822"
			y2="41.788"
			gradientUnits="userSpaceOnUse"
		>
			<stop offset="0" stop-color="#fea460" />
			<stop offset=".033" stop-color="#feaa6a" />
			<stop offset=".197" stop-color="#fec497" />
			<stop offset=".362" stop-color="#ffd9bd" />
			<stop offset=".525" stop-color="#ffeada" />
			<stop offset=".687" stop-color="#fff5ee" />
			<stop offset=".846" stop-color="#fffdfb" />
			<stop offset="1" stop-color="#fff" />
		</linearGradient>
		<path
			fill="url(#SVGID_1_)"
			d="M40.178,7.822c-2.538-2.538-6.654-2.538-9.192,0l-2.475,2.475L9.098,29.709	c-0.253,0.253-0.434,0.569-0.523,0.916L5.951,40.832c-0.19,0.737,0.481,1.407,1.218,1.218l10.207-2.625	c0.347-0.089,0.663-0.27,0.916-0.523l13.578-13.578l5.835-5.835l2.475-2.475C42.716,14.476,42.716,10.36,40.178,7.822z"
		/>
		<path
			fill="none"
			stroke="#fe7c12"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="3"
			d="M31.868,25.324L18.291,38.902c-0.253,0.253-0.569,0.434-0.916,0.523L7.168,42.049	c-0.737,0.19-1.407-0.481-1.218-1.218l2.625-10.207c0.089-0.347,0.27-0.663,0.523-0.916l3.708-3.708"
		/>
		<polyline
			fill="none"
			stroke="#fe7c12"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="3"
			points="17.982,20.826 28.511,10.297 37.703,19.489"
		/>
		<path
			fill="none"
			stroke="#fe7c12"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="3"
			d="M40.178,7.822L40.178,7.822c-2.538-2.538-6.654-2.538-9.192,0l-2.475,2.475l9.192,9.192l2.475-2.475	C42.716,14.476,42.716,10.36,40.178,7.822z"
		/>
	</svg>
);

export const TrashIcon: React.FC<IconProps> = ({ ...props }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="32"
		height="32"
		viewBox="0 0 24 24"
		fill="none"
		{...props}
	>
		<path
			d="M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98M8.5 4.97l.22-1.31C8.88 2.71 9 2 10.69 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3M18.85 9.14l-.65 10.07C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5h3.33M9.5 12.5h5"
			stroke="#FF8A65"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		></path>
	</svg>
);
