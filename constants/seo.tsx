import { SeoProps } from "@/types";
import { frontendBaseUrl } from "./variables";

export class AppSeo {
	static title: SeoProps["title"] = "Settle It";
	static description: SeoProps["description"] =
		"Blend in the fun and let us handle your expenses.";
	static image: SeoProps["image"] = `${frontendBaseUrl}/og-image.png`;
	static canonical: SeoProps["canonical"] = frontendBaseUrl;
	static author: SeoProps["author"];
	static url: SeoProps["url"];
	static type: SeoProps["type"];
	static siteName: SeoProps["siteName"];
	static themeColor: SeoProps["themeColor"] = "#4AA63C";
	static fullLogo: string = `${frontendBaseUrl}/logo-full.png`;
	static icons: SeoProps["icons"] = [
		"icon",
		"shortcut icon",
		"apple-touch-icon",
	].map((item) => {
		return {
			rel: item,
			href: "/favicon.ico",
			type: "icon/ico",
		};
	});
	static twitter: SeoProps["twitter"] = {
		card: "summary_large_image",
		site: "@akshatmittal61",
		author: "@akshatmittal61",
		title: AppSeo.title,
		description: AppSeo.description,
		image: `${frontendBaseUrl}/og-image.png`,
		url: frontendBaseUrl,
	};
	static og: SeoProps["og"] = {
		title: AppSeo.title,
		description: AppSeo.description,
		images: [
			{
				url: "/images/og-image.png",
				secureUrl: `${frontendBaseUrl}/og-image.png`,
				type: "image/png",
				width: 1200,
				height: 630,
				alt: AppSeo.title,
			},
			{
				url: `${frontendBaseUrl}/favicon-192.png`,
				secureUrl: `${frontendBaseUrl}/favicon-192.png`,
				type: "image/png",
				width: 192,
				height: 192,
				alt: AppSeo.title,
			},
			{
				url: `${frontendBaseUrl}/favicon-512.png`,
				secureUrl: `${frontendBaseUrl}/favicon-512.png`,
				type: "image/png",
				width: 512,
				height: 512,
				alt: AppSeo.title,
			},
		],
		url: frontendBaseUrl,
		type: "website",
		siteName: AppSeo.title,
	};
}
