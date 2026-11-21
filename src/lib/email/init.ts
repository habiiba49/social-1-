import {MailjetProvider}  from "../../pkg/email/mailjit";
import { NodemailerProvider } from "../../pkg/email/nodemailer";
import { env } from "../config/env";

export const mailjetProvider = new MailjetProvider ({
    apiKey: env.mailjet.apiKey,
    apiSecret: env.mailjet.apiSecret,
    fromEmail: env.mailjet.fromEmail,
    fromName: env.mailjet.fromName
})

export const nodemailkerProivider = new NodemailerProvider (env.nodemailer);