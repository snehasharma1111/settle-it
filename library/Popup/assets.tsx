import React from "react";
import { IconProps } from "./types";

export const CloseIcon: React.FC<IconProps> = ({ ...props }) => (
	<svg
		{...props}
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
	>
		<g clipPath="url(#clip0_494_1460)">
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M2.00098 11.998C2.00098 17.521 6.47798 21.998 12.001 21.998C17.524 21.998 22.001 17.521 22.001 11.998C22.001 6.47505 17.524 1.99805 12.001 1.99805C6.47798 1.99805 2.00098 6.47505 2.00098 11.998ZM17.6578 17.6549C16.1575 19.1552 14.1227 19.998 12.001 19.998C9.87924 19.998 7.84441 19.1552 6.34412 17.6549C4.84383 16.1546 4.00098 14.1198 4.00098 11.998C4.00098 9.87631 4.84383 7.84148 6.34412 6.34119C7.84441 4.8409 9.87924 3.99805 12.001 3.99805C14.1227 3.99805 16.1575 4.8409 17.6578 6.34119C19.1581 7.84148 20.001 9.87631 20.001 11.998C20.001 14.1198 19.1581 16.1546 17.6578 17.6549Z"
				fill="#FFE5E5"
			/>
			<path
				d="M12.001 10.584L14.829 7.75505L16.244 9.17005L13.415 11.998L16.244 14.826L14.829 16.241L12.001 13.412L9.17298 16.241L7.75798 14.826L10.587 11.998L7.75798 9.17005L9.17298 7.75505L12.001 10.584Z"
				fill="#FF6666"
			/>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M12.001 19.998C14.1227 19.998 16.1575 19.1552 17.6578 17.6549C19.1581 16.1546 20.001 14.1198 20.001 11.998C20.001 9.87631 19.1581 7.84148 17.6578 6.34119C16.1575 4.8409 14.1227 3.99805 12.001 3.99805C9.87924 3.99805 7.84441 4.8409 6.34412 6.34119C4.84383 7.84148 4.00098 9.87631 4.00098 11.998C4.00098 14.1198 4.84383 16.1546 6.34412 17.6549C7.84441 19.1552 9.87924 19.998 12.001 19.998ZM14.829 7.75505L12.001 10.584L9.17298 7.75505L7.75798 9.17005L10.587 11.998L7.75798 14.826L9.17298 16.241L12.001 13.412L14.829 16.241L16.244 14.826L13.415 11.998L16.244 9.17005L14.829 7.75505Z"
				fill="#FFE5E5"
			/>
		</g>
		<defs>
			<clipPath id="clip0_494_1460">
				<rect width="24" height="24" fill="white" />
			</clipPath>
		</defs>
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
