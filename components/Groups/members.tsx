import { api } from "@/connections";
import { fallbackAssets } from "@/constants";
import { Responsive } from "@/layouts";
import { Avatar, Avatars, Button, Input, Typography } from "@/library";
import { IUser } from "@/types/user";
import { debounce, stylesConfig } from "@/utils/functions";
import Image from "next/image";
import React, { useState } from "react";
import styles from "./styles.module.scss";

interface ICreateGroupMembersProps {
	onSave: () => void;
	selectedMembers: Array<IUser>;
	setSelectedMembers: (_: Array<IUser>) => void;
}

const classes = stylesConfig(styles, "create-group-members");

const CreateGroupMembers: React.FC<ICreateGroupMembersProps> = ({
	onSave,
	selectedMembers,
	setSelectedMembers,
}) => {
	const [searching, setSearching] = useState(false);
	const [searchResults, setSearchResults] = useState<Array<IUser>>([]);

	const handleSearch = async (searchStr: any) => {
		try {
			setSearching(true);
			const res = await api.user.searchForUsers(searchStr);
			setSearchResults(res.data);
		} catch (error) {
			console.error(error);
		} finally {
			setSearching(false);
		}
	};

	const handleChange = (e: any) => {
		if (e.target.value.length >= 3)
			debounce(handleSearch, 1000)(e.target.value);
		else setSearchResults([]);
	};

	const handleSelectUser = (user: IUser) => {
		const isUserSelected = selectedMembers
			.map((user) => user.id)
			.includes(user.id);
		if (isUserSelected) {
			const filteredUser = selectedMembers.filter(
				(u) => u.id !== user.id
			);
			setSelectedMembers(filteredUser);
		} else {
			setSelectedMembers([...selectedMembers, user]);
		}
	};

	return (
		<Responsive.Row className={classes("")}>
			<Responsive.Col xlg={100} lg={100} md={100} sm={100} xsm={100}>
				<Input
					name="username"
					placeholder="Username"
					size="small"
					onChange={handleChange}
				/>
			</Responsive.Col>
			<Responsive.Col xlg={100} lg={100} md={100} sm={100} xsm={100}>
				{selectedMembers.length > 0 ? (
					<div className={classes("-members-bar")}>
						<Avatars stack={false} size={32}>
							{selectedMembers.map((user) => ({
								src: user.avatar || fallbackAssets.avatar,
								alt: user.name || "User",
							}))}
						</Avatars>
					</div>
				) : null}
			</Responsive.Col>
			{searching ? (
				<Responsive.Col xlg={100} lg={100} md={100} sm={100} xsm={100}>
					<p className={classes("-loading")}>Searching...</p>
				</Responsive.Col>
			) : searchResults.length === 0 ? (
				<Responsive.Col xlg={100} lg={100} md={100} sm={100} xsm={100}>
					<div className={classes("-placeholder")}>
						<Image
							src="/vectors/empty-records.svg"
							alt="empty-records"
							width={1920}
							height={1080}
						/>
						<Typography>
							Please type at least 3 characters of user email
						</Typography>
					</div>
				</Responsive.Col>
			) : (
				searchResults.map((user) => (
					<Responsive.Col
						key={user.id}
						xlg={25}
						lg={33}
						md={50}
						sm={100}
						xsm={100}
						className={classes("-member-col")}
					>
						<div
							className={classes("-member")}
							onClick={() => {
								handleSelectUser(user);
							}}
						>
							<Avatar
								src={user.avatar || fallbackAssets.avatar}
								alt={user.name || "User"}
								size={36}
							/>
							<div className={classes("-member-info")}>
								<Typography weight="medium">
									{user.name}
								</Typography>
								<Typography size="sm">{user.email}</Typography>
							</div>
						</div>
					</Responsive.Col>
				))
			)}
			<Responsive.Col xlg={100} lg={100} md={100} sm={100} xsm={100}>
				<Button onClick={() => onSave()} size="small" type="button">
					Save
				</Button>
			</Responsive.Col>
		</Responsive.Row>
	);
};

export default CreateGroupMembers;
