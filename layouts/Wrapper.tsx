import { frontendBaseUrl } from "@/constants/variables";
import React from "react";
import { Toaster } from "react-hot-toast";
import Seo from "./Seo";

const Wrapper: React.FC<any> = ({ children }) => {
	return (
		<>
			<Seo
				title="Settle It!"
				description="Blend in the fun and let us handle your expenses."
				image={`${frontendBaseUrl}/og-image.png`}
				canonical={frontendBaseUrl}
				themeColor="#4AA63C"
				icons={["icon", "shortcut icon", "apple-touch-icon"].map(
					(item) => {
						return {
							rel: item,
							href: "/favicon.ico",
							type: "icon/ico",
						};
					}
				)}
				twitter={{
					card: "summary_large_image",
					site: "@akshatmittal61",
					author: "@akshatmittal61",
					title: "Settle It!",
					description:
						"Blend in the fun and let us handle your expenses.",
					image: `${frontendBaseUrl}/og-image.png`,
					url: frontendBaseUrl,
				}}
				og={{
					title: "Settle It!",
					description:
						"Blend in the fun and let us handle your expenses.",
					images: [
						{
							url: "/images/og-image.png",
							secureUrl: `${frontendBaseUrl}/og-image.png`,
							type: "image/png",
							width: 1200,
							height: 630,
							alt: "Settle It!",
						},
						{
							url: `${frontendBaseUrl}/favicon-192.png`,
							secureUrl: `${frontendBaseUrl}/favicon-192.png`,
							type: "image/png",
							width: 192,
							height: 192,
							alt: "Settle It!",
						},
						{
							url: `${frontendBaseUrl}/favicon-512.png`,
							secureUrl: `${frontendBaseUrl}/favicon-512.png`,
							type: "image/png",
							width: 512,
							height: 512,
							alt: "Settle It!",
						},
					],
					url: frontendBaseUrl,
					type: "website",
					siteName: "Settle It!",
				}}
			/>
			{children}
			<Toaster position="top-center" />
		</>
	);
};

export default Wrapper;
