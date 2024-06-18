import { routes } from "@/constants";
import { useStore } from "@/hooks";
import { Typography } from "@/library";
import { authMiddleware } from "@/middlewares";
import styles from "@/styles/pages/Profile.module.scss";
import { IUser } from "@/types/user";
import { stylesConfig } from "@/utils/functions";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FiArrowLeft, FiLogOut } from "react-icons/fi";

const classes = stylesConfig(styles, "profile-page");

interface IProfilePageProps {
	user: IUser;
}

const ProfilePage: React.FC<IProfilePageProps> = (props) => {
	const router = useRouter();
	const { dispatch, user, setUser, logoutUser } = useStore();

	const logout = async () => {
		await dispatch(logoutUser()).unwrap();
		router.push(routes.LOGIN);
	};

	useEffect(() => {
		if (!user) {
			dispatch(setUser(props.user));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<main className={classes("")}>
			<div className={classes("-banner")}>
				<button
					onClick={() => router.back()}
					className={classes("-banner-btn")}
				>
					<FiArrowLeft />
				</button>
				<button
					onClick={logout}
					className={classes("-banner-btn", "-banner-btn--flat")}
				>
					<FiLogOut />
					<Typography size="s">Logout</Typography>
				</button>
			</div>
		</main>
	);
};

export default ProfilePage;

export const getServerSideProps = async (context: any) => {
	return await authMiddleware.page(context, {
		async onLoggedInAndOnboarded(user) {
			return {
				props: {
					user,
				},
			};
		},
		onLoggedInAndNotOnboarded() {
			return {
				redirect: {
					destination: routes.ONBOARDING,
					permanent: false,
				},
			};
		},
		onLoggedOut() {
			return {
				redirect: {
					destination: routes.LOGIN,
					permanent: false,
				},
			};
		},
	});
};
