export interface MailProvider {
    SendMail (email: string , subject: string ,html: string ): Promise<void>
}
