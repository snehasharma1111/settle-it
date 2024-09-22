import { Auth, Auth as Components } from "@/components";
import { api } from "@/connections";
import { routes } from "@/constants";
import { useStore } from "@/hooks";
import { Seo } from "@/layouts";
import { Typography } from "@/library";
import { logger } from "@/log";
import { notify } from "@/messages";
import { authMiddleware } from "@/middlewares";
import styles from "@/styles/pages/Auth.module.scss";
import { IUser, ServerSideResult } from "@/types";
import { stylesConfig } from "@/utils";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const classes = stylesConfig(styles, "auth");

type T_Auth_Frame = "input" | "otp-verification" | "onboarding";

interface LoginPageProps {
	frame: T_Auth_Frame;
	user?: IUser;
}

const LoginPage: React.FC<LoginPageProps> = (props) => {
	const { setUser, dispatch } = useStore();
	const router = useRouter();
	const [authFrame, setAuthFrame] = useState<T_Auth_Frame>(props.frame);
	const [email, setEmail] = useState("");
	const [requestingOtp, setRequestingOtp] = useState(false);
	const [verifyingOtp, setVerifyingOtp] = useState(false);
	const [updatingUserDetails, setUpdatingUserDetails] = useState(false);

	const requestOtpWithEmail = async () => {
		try {
			setRequestingOtp(true);
			await api.auth.requestOtpWithEmail(email);
			setAuthFrame("otp-verification");
		} catch (error: any) {
			logger.error(error);
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
			dispatch(setUser(res.data));
			if (res.data.name) {
				const redirectUrl =
					router.query.redirect?.toString() ?? routes.HOME;
				router.push(redirectUrl);
			} else {
				setAuthFrame("onboarding");
			}
		} catch (error: any) {
			logger.error(error);
			notify.error(error);
		} finally {
			setVerifyingOtp(false);
		}
	};

	const saveUserDetails = async (data: Auth.UserDetails) => {
		try {
			setUpdatingUserDetails(true);
			const res = await api.user.updateUser(data);
			setUser(res.data);
			router.push(routes.HOME);
		} catch (error: any) {
			logger.error(error);
			notify.error(error);
		} finally {
			setUpdatingUserDetails(false);
		}
	};

	useEffect(() => {
		if (props.user) {
			dispatch(setUser(props.user));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.user]);

	return (
		<>
			<Seo title="Login | Settle It" />
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
					) : authFrame === "otp-verification" ? (
						<Components.Verification
							email={email}
							verifyingOtp={verifyingOtp}
							onSubmit={verifyOtp}
							onGoBack={() => {
								setAuthFrame("input");
							}}
						/>
					) : authFrame === "onboarding" ? (
						<Components.Onboarding
							loading={updatingUserDetails}
							onContinue={saveUserDetails}
						/>
					) : null}
				</section>
				<Typography size="sm" className={classes("-footer")} as="p">
					By joining, you agree to the Settle It Terms of Service and
					to occasionally receive emails from us. Please read our
					Privacy Policy to learn how we use your personal data.
				</Typography>
			</main>
		</>
	);
};

export default LoginPage;

export const getServerSideProps = (
	context: any
): Promise<ServerSideResult<LoginPageProps>> => {
	return authMiddleware.page(context, {
		onLoggedInAndOnboarded() {
			const { redirect } = context.query;
			return {
				redirect: {
					destination: redirect ?? routes.HOME,
					permanent: false,
				},
			};
		},
		onLoggedInAndNotOnboarded(user) {
			return {
				props: {
					frame: "onboarding",
					user,
				},
			};
		},
		onLoggedOut() {
			return {
				props: {
					frame: "input",
				},
			};
		},
	});
};
