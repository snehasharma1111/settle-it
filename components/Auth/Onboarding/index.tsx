import { Button, Input } from "@/library";
import { stylesConfig } from "@/utils";
import React, { useState } from "react";
import { FiCheck } from "react-icons/fi";
import styles from "./styles.module.scss";

export type UserDetails = {
	name: string;
	phone: string;
	avatar: string;
};

interface IAuthOnboardingProps {
	loading: boolean;
	onContinue: (_: UserDetails) => void;
}

const classes = stylesConfig(styles, "auth-onboarding");

const AuthOnboarding: React.FC<IAuthOnboardingProps> = ({
	loading,
	onContinue,
}) => {
	const [data, setData] = useState<UserDetails>({
		name: "",
		phone: "",
		avatar: "",
	});
	const handleChange = (e: any) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		onContinue(data);
	};
	return (
		<form className={classes("-form")} onSubmit={handleSubmit}>
			<Input
				placeholder="Full Name"
				name="name"
				type="text"
				required
				autoFocus
				value={data.name}
				onChange={handleChange}
			/>
			<Input
				placeholder="Phone No."
				name="phone"
				type="text"
				required
				value={data.phone}
				onChange={handleChange}
			/>
			<Input
				placeholder="Avatar URL"
				name="avatar"
				type="text"
				value={data.avatar}
				onChange={handleChange}
			/>
			<Button
				icon={<FiCheck />}
				iconPosition="left"
				size="large"
				type="submit"
				loading={loading}
			>
				Continue
			</Button>
		</form>
	);
};

export default AuthOnboarding;
