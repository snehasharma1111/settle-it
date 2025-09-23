import { Footer, Header, Loader, SideBar } from "@/components";
import { AppSeo, routes } from "@/constants";
import { useDevice, useStore } from "@/hooks";
import { Seo } from "@/layouts";
import { IUser } from "@/types";
import { stylesConfig } from "@/utils";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import styles from "./styles.module.scss";

interface WrapperProps {
	children: React.ReactNode;
	user?: IUser;
}

const classes = stylesConfig(styles, "wrapper");

export const Wrapper: React.FC<WrapperProps> = ({ children, user }) => {
	const router = useRouter();
	const { type: device } = useDevice();
	const { initStore, syncNetworkStatus, closeSideBar } = useStore();
	const [showLoader, setShowLoader] = useState(false);
	const pagesSupportingHeader: Array<string> = [
		routes.ROOT,
		routes.ERROR,
		routes.PRIVACY_POLICY,
		routes.HOME,
		routes.GROUP("[id]"),
		routes.GROUP_SUMMARY("[id]"),
		routes.GROUP_TRANSACTIONS("[id]"),
		routes.PROFILE,
	];
	const pagesSupportingFooter: Array<string> = [
		routes.ROOT,
		routes.ERROR,
		routes.PRIVACY_POLICY,
	];
	const pagesSupportingContainer: Array<string> = [
		routes.HOME,
		routes.GROUP("[id]"),
		routes.GROUP_SUMMARY("[id]"),
		routes.GROUP_TRANSACTIONS("[id]"),
		routes.PROFILE,
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
		if (device === "mobile") {
			closeSideBar();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [device, router.pathname]);

	return (
		<>
			<Seo
				title={AppSeo.title}
				description={AppSeo.description}
				image={AppSeo.image}
				canonical={AppSeo.canonical}
				themeColor={AppSeo.themeColor}
				icons={AppSeo.icons}
				twitter={AppSeo.twitter}
				og={AppSeo.og}
				author={AppSeo.author}
				siteName={AppSeo.siteName}
			/>
			{pagesSupportingHeader.includes(router.pathname) ? (
				<Header />
			) : null}
			{pagesSupportingContainer.includes(router.pathname) ? (
				<SideBar />
			) : null}
			{showLoader ? <Loader.Bar /> : null}
			<main
				className={
					pagesSupportingContainer.includes(router.pathname)
						? classes("")
						: ""
				}
			>
				{children}
			</main>
			{pagesSupportingFooter.includes(router.pathname) ? (
				<Footer />
			) : null}
			<Toaster position="top-center" />
		</>
	);
};
