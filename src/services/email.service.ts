import nodemailer, { Transporter } from "nodemailer";
import { config } from "../configs/config";

class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      from: "Node.js",
      auth: {
        user: config.smtpEmail,
        pass: config.smtpPassword,
      },
    });
  }

  public async sendEmail(email: string): Promise<void> {
    await this.transporter.sendMail({
      to: email,
      subject: "Test",
      text: "Test",
    });
  }
}

export const emailService = new EmailService();
