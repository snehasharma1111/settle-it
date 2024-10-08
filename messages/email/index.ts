import { sendEmailService } from "./sender.service";
import { EMAIL_TEMPLATE } from "./types";
import { getEmailTemplate } from "./util";

export const sendEmailTemplate = async (
	to: string,
	subject: string,
	template: EMAIL_TEMPLATE,
	data: any
) => {
	const html = getEmailTemplate(template, data);
	await sendEmailService(to, subject, html);
};
