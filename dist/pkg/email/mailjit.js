"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailjetProvider = void 0;
const node_mailjet_1 = __importDefault(require("node-mailjet"));
class MailjetProvider {
    client;
    fromEmail;
    fromName;
    constructor(config) {
        this.client = new node_mailjet_1.default({
            apiKey: config.apiKey,
            apiSecret: config.apiSecret
        });
        this.fromName = config.fromName;
        this.fromEmail = config.fromEmail;
    }
    async SendMail(email, subject, html) {
        await this.client.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: this.fromEmail,
                        Name: this.fromName,
                    },
                    To: [
                        {
                            Email: email,
                        },
                    ],
                    Subject: subject,
                    HTMLPart: html,
                },
            ],
        });
    }
}
exports.MailjetProvider = MailjetProvider;
