import { fallbackAssets } from "@/constants";
import { useStore } from "@/hooks";
import { Responsive } from "@/layouts";
import { Avatars, Button, Input, Pane, Typography } from "@/library";
import { CreateGroupData, IUser } from "@/types";
import { notify, stylesConfig } from "@/utils";
import React, { useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import Members from "./members";
import styles from "./styles.module.scss";

interface ICreateGroupProps {
	onClose: () => void;
	onSave: (_: CreateGroupData) => void;
	loading: boolean;
}

const classes = stylesConfig(styles, "create-group");

const CreateGroup: React.FC<ICreateGroupProps> = ({
	onClose,
	loading,
	onSave,
}) => {
	const { user: loggedInuser } = useStore();
	const [fields, setFields] = useState<CreateGroupData>({
		name: "",
		icon: "",
		banner: "",
		type: "",
		members: [],
	});
	const [selectedMembers, setSelectedMembers] = useState<Array<IUser>>([]);
	const [manageMembers, setManageMembers] = useState(false);
	const handleChange = (e: any) => {
		setFields({ ...fields, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		if (
			selectedMembers.length === 0 ||
			(selectedMembers.length === 1 &&
				selectedMembers[0].id === loggedInuser.id)
		) {
			return notify.error("Please select at least 1 member");
		}
		if (selectedMembers.map((user) => user.id).includes(loggedInuser.id)) {
			onSave(fields);
		} else {
			onSave({
				...fields,
				members: [...fields.members, loggedInuser.id],
			});
		}
	};

	return (
		<Pane onClose={onClose} className={classes("")} title="Create Group">
			<form className={classes("-form")} onSubmit={handleSubmit}>
				{manageMembers ? (
					<Responsive.Row>
						<Members
							selectedMembers={selectedMembers}
							setSelectedMembers={(users) =>
								setSelectedMembers(users)
							}
							onSave={() => {
								setFields({
									...fields,
									members: selectedMembers.map(
										(user) => user.id
									),
								});
								setManageMembers(false);
							}}
						/>
					</Responsive.Row>
				) : (
					<Responsive.Row>
						<Responsive.Col
							xlg={50}
							lg={50}
							md={50}
							sm={100}
							xsm={100}
						>
							<Input
								label="Name"
								name="name"
								type="text"
								placeholder="Group Name. eg. Trip to NYC"
								required
								size="small"
								value={fields.name}
								onChange={handleChange}
							/>
						</Responsive.Col>
						<Responsive.Col
							xlg={50}
							lg={50}
							md={50}
							sm={100}
							xsm={100}
						>
							<Input
								label="Icon URL (optional)"
								name="icon"
								placeholder="https://example.com/icon.png"
								size="small"
								value={fields.icon}
								onChange={handleChange}
							/>
						</Responsive.Col>
						<Responsive.Col
							xlg={50}
							lg={50}
							md={50}
							sm={100}
							xsm={100}
						>
							<Input
								label="Banner URL (optional)"
								name="banner"
								placeholder="https://example.com/banner.png"
								size="small"
								value={fields.banner}
								onChange={handleChange}
							/>
						</Responsive.Col>
						<Responsive.Col
							xlg={50}
							lg={50}
							md={50}
							sm={100}
							xsm={100}
						>
							<Input
								label="Type"
								name="type"
								size="small"
								value={fields.type}
								onChange={handleChange}
								dropdown={{
									enabled: true,
									options: [
										{
											id: "Trip",
											label: "Trip",
											value: "Trip",
										},
										{
											id: "Outing",
											label: "Outing",
											value: "Outing",
										},
										{
											id: "Other",
											label: "Other",
											value: "Other",
										},
									],
									onSelect(option) {
										setFields({
											...fields,
											type: option.value,
										});
									},
								}}
							/>
						</Responsive.Col>
						<Responsive.Col
							xlg={100}
							lg={100}
							md={100}
							sm={100}
							xsm={100}
							className={classes("-members-col", "-manage-col")}
						>
							<div
								className={classes("-members-bar")}
								onClick={() =>
									setManageMembers((prev) => !prev)
								}
							>
								<Typography size="s">Manage members</Typography>
								<button
									type="button"
									onClick={() =>
										setManageMembers((prev) => !prev)
									}
								>
									<FiExternalLink />
								</button>
							</div>
							{selectedMembers.length > 0 ? (
								<div className={classes("-members-bar")}>
									<Avatars stack={false} size={32}>
										{selectedMembers.map((user) => ({
											src:
												user.avatar ||
												fallbackAssets.avatar,
											alt: user.name || "User",
										}))}
									</Avatars>
								</div>
							) : null}
						</Responsive.Col>
						<Responsive.Col
							xlg={100}
							lg={100}
							md={100}
							sm={100}
							xsm={100}
						>
							<Button
								className={classes("-submit")}
								type="submit"
								loading={loading}
							>
								Create
							</Button>
						</Responsive.Col>
					</Responsive.Row>
				)}
			</form>
		</Pane>
	);
};

export default CreateGroup;
