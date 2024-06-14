import { Auth as Components } from "@/components";
import { api } from "@/connections";
import { routes } from "@/constants";
import { useStore } from "@/hooks";
import { Typography } from "@/library";
import { notify } from "@/messages";
import { authMiddleware } from "@/middlewares";
import styles from "@/styles/pages/Auth.module.scss";
import { stylesConfig } from "@/utils/functions";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";

const classes = stylesConfig(styles, "auth");

const LoginPage: React.FC = () => {
	const { setUser } = useStore();
	const router = useRouter();
	const [authFrame, setAuthFrame] = useState<"input" | "otp-verification">(
		"input"
	);
	const [email, setEmail] = useState("");
	const [requestingOtp, setRequestingOtp] = useState(false);
	const [verifyingOtp, setVerifyingOtp] = useState(false);

	const requestOtpWithEmail = async () => {
		try {
			setRequestingOtp(true);
			await api.auth.requestOtpWithEmail(email);
			setAuthFrame("otp-verification");
		} catch (error: any) {
			console.error(error);
			notify.error(error);
		} finally {
			setRequestingOtp(false);
		}
	};

	const verifyOtp = async (otp: string) => {
		try {
			setVerifyingOtp(true);
			await api.auth.verifyOtpWithEmail(email, otp);
			const res = await api.auth.loginWithEmail(email, otp);
			setUser(res.data);
			if (res.data.name) {
				const redirectUrl =
					router.query.redirect?.toString() ?? routes.HOME;
				router.push(redirectUrl);
			} else {
				router.push(routes.ONBOARDING);
			}
		} catch (error: any) {
			console.error(error);
			notify.error(error);
		} finally {
			setVerifyingOtp(false);
		}
	};

	return (
		<main className={classes("")}>
			<span />
			<section>
				<Image
					src="/logo-full.png"
					alt="settle it logo"
					height={1920}
					width={1080}
					className={classes("-logo")}
				/>
				{authFrame === "input" ? (
					<Components.Content
						email={email}
						setEmail={(value) => setEmail(value)}
						onContinueWithEmail={requestOtpWithEmail}
						requestingOtp={requestingOtp}
					/>
				) : (
					<Components.Verification
						email={email}
						verifyingOtp={verifyingOtp}
						onSubmit={verifyOtp}
						onGoBack={() => {
							setAuthFrame("input");
						}}
					/>
				)}
			</section>
			<Typography size="sm" className={classes("-footer")} as="p">
				By joining, you agree to the Settle It Terms of Service and to
				occasionally receive emails from us. Please read our Privacy
				Policy to learn how we use your personal data.
			</Typography>
		</main>
	);
};

export default LoginPage;

export const getServerSideProps = async (context: any) => {
	const { redirect } = context.query;
	return await authMiddleware.page(context, {
		onLoggedInAndOnboarded() {
			return {
				redirect: {
					destination: redirect ?? routes.HOME,
					permanent: false,
				},
			};
		},
		onLoggedInAndNotOnboarded() {
			return {
				redirect: {
					destination: `${routes.ONBOARDING}?redirect=${routes.HOME}`,
					permanent: false,
				},
			};
		},
		onLoggedOut() {
			return {
				props: {},
			};
		},
	});
};
