import { ReactElement } from "react";
import { FaInstagram, FaLinkedin, FaTwitter, FaWhatsapp } from "react-icons/fa";

export interface social {
	name: string;
	href: string;
	icon: ReactElement;
}

export interface IFooterLink {
	text: string;
	href?: string;
	path?: string;
}

export const socials: social[] = [
	{
		name: "linkedin",
		href: "https://www.linkedin.com/in/akshatmittal61",
		icon: <FaLinkedin />,
	},
	{
		name: "twitter",
		href: "https://x.com/akshatmittal61",
		icon: <FaTwitter />,
	},
	{
		name: "instagram",
		href: "https://www.instagram.com/akshatmittal61",
		icon: <FaInstagram />,
	},
	{
		name: "whatsapp",
		href: "https://wa.me/919456849466",
		icon: <FaWhatsapp />,
	},
];
