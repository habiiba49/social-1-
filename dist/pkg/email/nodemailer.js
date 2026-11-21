"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodemailerProvider = void 0;
const nodemailer_1 = require("nodemailer");
class NodemailerProvider {
    client;
    fromEmail;
    fromName;
    constructor(config) {
        this.client = (0, nodemailer_1.createTransport)({
            host: config.host,
            port: config.port,
            secure: false,
            auth: {
                user: config.user,
                pass: config.password
            }
        });
        this.fromName = config.fromName;
        this.fromEmail = config.fromEmail;
    }
    async SendMail(email, subject, html) {
        await this.client.sendMail({
            from: this.fromEmail,
            to: email,
            subject: subject,
            html: html
        });
    }
}
exports.NodemailerProvider = NodemailerProvider;
