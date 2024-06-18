import { api } from "@/connections";
import { fallbackAssets, regex } from "@/constants";
import { useDebounce } from "@/hooks";
import { Responsive } from "@/layouts";
import { Avatar, Avatars, Button, Input, Typography } from "@/library";
import { notify } from "@/messages";
import { IUser } from "@/types/user";
import { stylesConfig } from "@/utils/functions";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";

interface ICreateGroupMembersProps {
	onSave: () => void;
	selectedMembers: Array<IUser>;
	setSelectedMembers: (_: Array<IUser>) => void;
}

interface MembersPlaceholderProps {
	loading: boolean;
	searchStr: string;
	onInvited: (_: IUser) => void;
}

const classes = stylesConfig(styles, "create-group-members");

const MembersPlaceholder: React.FC<MembersPlaceholderProps> = ({
	loading,
	searchStr,
	onInvited,
}) => {
	const [inviting, setInviting] = useState(false);
	const inviteMember = async () => {
		try {
			setInviting(true);
			const res = await api.user.inviteUser(searchStr);
			onInvited(res.data);
		} catch (error) {
			notify.error(error);
		} finally {
			setInviting(false);
		}
	};
	if (loading) {
		return (
			<Responsive.Col xlg={100} lg={100} md={100} sm={100} xsm={100}>
				<p className={classes("-loading")}>Searching...</p>
			</Responsive.Col>
		);
	}
	if (searchStr.length < 3) {
		return (
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
		);
	}
	if (searchStr.length >= 3) {
		if (!regex.email.test(searchStr)) {
			return (
				<Responsive.Col xlg={100} lg={100} md={100} sm={100} xsm={100}>
					<div className={classes("-placeholder")}>
						<Image
							src="/vectors/empty-records.svg"
							alt="empty-records"
							width={1920}
							height={1080}
						/>
						<Typography>Please enter a valid email</Typography>
					</div>
				</Responsive.Col>
			);
		}
		return (
			<Responsive.Col xlg={100} lg={100} md={100} sm={100} xsm={100}>
				<div className={classes("-placeholder")}>
					<Typography>
						Seems like{" "}
						<span style={{ color: "var(--accent-color)" }}>
							{searchStr}
						</span>{" "}
						has not joined us yet.
					</Typography>
					<Typography>Want to invite them?</Typography>
					<Button
						className={classes("-button")}
						type="button"
						onClick={inviteMember}
						loading={inviting}
					>
						Invite
					</Button>
				</div>
			</Responsive.Col>
		);
	}
};

const CreateGroupMembers: React.FC<ICreateGroupMembersProps> = ({
	onSave,
	selectedMembers,
	setSelectedMembers,
}) => {
	const [searching, setSearching] = useState(false);
	const [searchResults, setSearchResults] = useState<Array<IUser>>([]);
	const [searchStr, debouncedSearchStr, setSearchStr] = useDebounce<string>(
		"",
		1000
	);

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

	useEffect(() => {
		if (
			debouncedSearchStr &&
			debouncedSearchStr.length >= 3 &&
			regex.email.test(debouncedSearchStr)
		) {
			handleSearch(debouncedSearchStr);
		}
	}, [debouncedSearchStr]);

	return (
		<Responsive.Row className={classes("")}>
			<Responsive.Col xlg={100} lg={100} md={100} sm={100} xsm={100}>
				<Input
					name="username"
					placeholder="Username"
					size="small"
					value={searchStr}
					onChange={(e: any) => setSearchStr(e.target.value)}
				/>
			</Responsive.Col>
			<Responsive.Col xlg={100} lg={100} md={100} sm={100} xsm={100}>
				{selectedMembers.length > 0 ? (
					<div className={classes("-members-bar")}>
						<Avatars stack={false} size={32}>
							{selectedMembers.map((user) => ({
								src: user.avatar || fallbackAssets.avatar,
								alt: user.name || user.email,
							}))}
						</Avatars>
					</div>
				) : null}
			</Responsive.Col>
			{searchResults.length === 0 ? (
				<MembersPlaceholder
					searchStr={searchStr}
					loading={searching}
					onInvited={(newUser) => {
						handleSelectUser(newUser);
						setSearchResults([newUser]);
						setSearchStr("");
					}}
				/>
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
