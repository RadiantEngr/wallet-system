import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const senderEmail = process.env.SENDER_EMAIL;
const senderPassword = process.env.SENDER_PASSWORD;
const sendMail = async (subject: string, content: string, to: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: senderEmail,
        pass: senderPassword,
      },
    });
    const message = {
      from: `report sender <${senderEmail}>`,
      to,
      subject,
      text: subject,
      html: content,
    };
    transporter.sendMail(message, () => {});
  } catch (err) {
    console.error(err.message);
  }
};

export default sendMail;
