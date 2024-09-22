import { fallbackAssets, routes } from "@/constants";
import { useStore } from "@/hooks";
import { Seo } from "@/layouts";
import { Avatar, Button, Input, Typography } from "@/library";
import { notify } from "@/messages";
import { authMiddleware } from "@/middlewares";
import styles from "@/styles/pages/Profile.module.scss";
import { IUser, ServerSideResult } from "@/types";
import { stylesConfig } from "@/utils";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiLogOut } from "react-icons/fi";

const classes = stylesConfig(styles, "profile-page");

interface IProfilePageProps {
	user: IUser;
}

const ProfilePage: React.FC<IProfilePageProps> = (props) => {
	const router = useRouter();
	const { dispatch, user, setUser, updateUser, logoutUser } = useStore();
	const [updating, setUpdating] = useState(false);
	const [fields, setFields] = useState({
		name: user.name || props.user.name || "",
		phone: user.phone || props.user.phone || "",
		avatar: user.avatar || props.user.avatar || "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFields({
			...fields,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setUpdating(true);
		try {
			await dispatch(updateUser(fields)).unwrap();
			notify.success("Updated successfully");
		} catch (error) {
			notify.error(error);
		} finally {
			setUpdating(false);
		}
	};

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
		<>
			<Seo title={`${user.name} - Profile | Settle It`} />
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
				<div className={classes("-meta")}>
					<Avatar
						src={
							user.avatar ||
							props.user.avatar ||
							fallbackAssets.avatar
						}
						alt={
							user.name ||
							props.user.name ||
							user.email ||
							props.user.email
						}
						size={160}
					/>
				</div>
				<form className={classes("-form")} onSubmit={handleSubmit}>
					<Input
						label="Name"
						name="name"
						type="text"
						required
						placeholder="Name"
						value={fields.name}
						onChange={handleChange}
					/>
					<Input
						label="Phone"
						name="phone"
						type="tel"
						required
						placeholder="Phone"
						value={fields.phone}
						onChange={handleChange}
					/>
					<Input
						label="Avatar"
						name="avatar"
						type="url"
						required
						placeholder="Avatar"
						value={fields.avatar}
						onChange={handleChange}
					/>
					<Button
						type="submit"
						loading={updating}
						className={classes("-form-btn")}
						size="large"
					>
						Save
					</Button>
				</form>
			</main>
		</>
	);
};

export default ProfilePage;

export const getServerSideProps = (
	context: any
): Promise<ServerSideResult<IProfilePageProps>> => {
	return authMiddleware.page(context, {
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
					destination: routes.ONBOARDING + "?redirect=/me",
					permanent: false,
				},
			};
		},
		onLoggedOut() {
			return {
				redirect: {
					destination: routes.LOGIN + "?redirect=/me",
					permanent: false,
				},
			};
		},
	});
};
