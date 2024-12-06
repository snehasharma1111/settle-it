import { Footer, Header, Loader, SideBar } from "@/components";
import { frontendBaseUrl, routes } from "@/constants";
import { useStore } from "@/hooks";
import { Seo } from "@/layouts";
import { IUser } from "@/types";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

interface WrapperProps {
	children: React.ReactNode;
	user?: IUser;
}

export const Wrapper: React.FC<WrapperProps> = ({ children, user }) => {
	const router = useRouter();
	const { initStore, syncNetworkStatus, isSidebarOpen, closeSideBar } =
		useStore();
	const [showLoader, setShowLoader] = useState(false);
	const staticPagesPaths: Array<string> = [
		routes.ROOT,
		routes.ERROR,
		routes.PRIVACY_POLICY,
	];

	// only show router when route is changing

	useEffect(() => {
		router.events.on("routeChangeStart", () => {
			setShowLoader(true);
		});
		router.events.on("routeChangeComplete", () => {
			setShowLoader(false);
		});
		router.events.on("routeChangeError", () => {
			setShowLoader(false);
		});
	}, [router.events]);

	useEffect(() => {
		initStore(user);
		setInterval(() => {
			syncNetworkStatus();
		}, 10000);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		closeSideBar();
	}, [router.pathname]);

	return (
		<>
			<Seo
				title="Settle It!"
				description="Blend in the fun and let us handle your expenses."
				image={`${frontendBaseUrl}/og-image.png`}
				canonical={frontendBaseUrl}
				author="Akshat Mittal"
				siteName="Settle It!"
				themeColor="#4AA63C"
				icons={["icon", "shortcut icon", "apple-touch-icon"].map(
					(item) => {
						return {
							rel: item,
							href: `${frontendBaseUrl}/favicon.ico`,
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
							url: `${frontendBaseUrl}/og-image.png`,
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
			{staticPagesPaths.includes(router.pathname) ? <Header /> : null}
			{isSidebarOpen ? <SideBar /> : null}
			{showLoader ? <Loader.Bar /> : null}
			{children}
			{staticPagesPaths.includes(router.pathname) ? <Footer /> : null}
			<Toaster position="top-center" />
		</>
	);
};
