import { Seo } from "@/layouts";
import { Typography } from "@/library";
import styles from "@/styles/pages/Home.module.scss";
import { stylesConfig } from "@/utils";
import React from "react";
import { AppSeo } from "@/constants";

const classes = stylesConfig(styles, "privacy-policy");

const PrivacyPolicyPage: React.FC = () => {
	return (
		<main className={classes("")}>
			<Seo title="Privacy Policy" />
			<article className="markdown-body">
				<Typography size="head-1" weight="medium" as="h1">
					Privacy Policy
				</Typography>
				<Typography as="p">
					<strong>Last Updated:</strong> September 22, 2024
				</Typography>
				<Typography as="h3" size="xl" weight="medium">
					1. Introduction
				</Typography>
				<Typography as="p">
					Welcome to {AppSeo.title}! We value your privacy and are
					committed to protecting your personal data. This privacy
					policy explains how we collect, use, and safeguard your
					information when you use our app and services.
				</Typography>
				<Typography as="h3" size="xl" weight="medium">
					2. Information We Collect
				</Typography>
				<Typography as="div">
					We may collect personal data that you provide directly, such
					as:
					<dl>
						<dt>Account Information</dt>
						<dd>
							Your name, email address, phone number, and profile
							picture when you create an account.
						</dd>
						<dt>Group and Expense Data</dt>
						<dd>
							Information related to the groups you join, expenses
							you add, and how much you owe or are owed.
						</dd>
					</dl>
				</Typography>
				<Typography as="h3" size="xl" weight="medium">
					3. How We Use Your Information
				</Typography>
				<Typography as="div">
					We use the information we collect for the following
					purposes:
					<ul>
						<li>
							To manage and track your expenses within the app.
						</li>
						<li>
							To show you group summaries and calculate amounts
							owed between users.
						</li>
						<li>
							To improve and personalize your experience with
							{AppSeo.title}.
						</li>
						<li>
							To provide customer support and respond to
							inquiries.
						</li>
					</ul>
				</Typography>
				<Typography as="h3" size="xl" weight="medium">
					4. Sharing Your Information
				</Typography>
				<Typography as="div">
					We may share your personal data in the following cases:
					<ul>
						<li>
							With Group Members: Expense-related data (amounts
							owed and paid) is shared with members of the groups
							you are part of.
						</li>
						<li>
							With people: People can search you with your email
							and read your name and profile picture.
						</li>
					</ul>
				</Typography>
				<Typography as="h3" size="xl" weight="medium">
					5. Data Security
				</Typography>
				<Typography as="p">
					We implement industry-standard security measures to protect
					your personal data. However, no method of transmission over
					the internet or electronic storage is completely secure, and
					we cannot guarantee absolute security.
				</Typography>
				<Typography as="h3" size="xl" weight="medium">
					6. Data Retention
				</Typography>
				<Typography as="p">
					We will retain your personal data for as long as necessary
					to fulfill the purposes outlined in this privacy policy or
					as required by law.
				</Typography>
				<Typography as="h3" size="xl" weight="medium">
					7. Your Data Rights
				</Typography>
				<Typography as="div">
					You have the following rights with respect to your personal
					data:
					<ul>
						<li>To access your personal data.</li>
						<li>To update your personal data.</li>
						<li>To delete your personal data.</li>
						<li>
							To object to the processing of your personal data.
						</li>
						<li>
							To withdraw consent to use your data at any time.
						</li>
					</ul>
				</Typography>
				<Typography as="h3" size="xl" weight="medium">
					8. Changes to This Privacy Policy
				</Typography>
				<Typography as="p">
					We may update this privacy policy from time to time. We will
					notify you of any changes by posting the updated policy on
					our website.
				</Typography>
			</article>
		</main>
	);
};

export default PrivacyPolicyPage;
