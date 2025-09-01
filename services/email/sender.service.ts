import { createTransport } from "nodemailer";
import { googleEmailConfig } from "@/config";
import { T_EMAIL_TEMPLATE } from "@/types";
import { getEmailTemplate } from "./template";
import { AppSeo } from "@/constants";

export class EmailService {
	private static getSMTPTransport() {
		const transportOptions = {
			service: "gmail",
			auth: {
				user: googleEmailConfig.email,
				pass: googleEmailConfig.password,
			},
		};
		return createTransport(transportOptions);
	}

	private static async send(to: string, subject: string, html: string) {
		return EmailService.getSMTPTransport().sendMail({
			from: {
				name: AppSeo.title || "",
				address: googleEmailConfig.email,
			},
			to,
			subject,
			html,
		});
	}

	private static async bulkSend(
		to: Array<string>,
		subject: string,
		html: string
	) {
		return EmailService.getSMTPTransport().sendMail({
			from: googleEmailConfig.email,
			bcc: to,
			subject,
			html,
		});
	}

	public static async sendByTemplate(
		to: string,
		subject: string,
		template: T_EMAIL_TEMPLATE,
		data: any
	) {
		const html = getEmailTemplate(template, data);
		return EmailService.send(to, subject, html);
	}

	public static async bulkSendByTemplate(
		to: Array<string>,
		subject: string,
		template: T_EMAIL_TEMPLATE,
		data: any
	) {
		const html = getEmailTemplate(template, data);
		return EmailService.bulkSend(to, subject, html);
	}
}
