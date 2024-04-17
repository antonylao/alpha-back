import * as nodeMailer from 'nodemailer';

export class MailerService {
  async sendMail(volunteerMail: string, volunteerId: number, subject: string, message: string) {
    try {
      console.log(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
      const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.ADMIN_EMAIL,
          pass: process.env.ADMIN_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: volunteerMail,
        subject,
        text: message,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(
        `E-mail envoyé à ${volunteerMail}, id: ${volunteerId}. Réponse du serveur:`,
        info.response
      );

    } catch (error) {
      throw error
    }
  }
}