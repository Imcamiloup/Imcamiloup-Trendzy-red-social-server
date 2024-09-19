import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const EMAIL_USER = process.env.EMAIL_ADMIN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendEmail = async (email: string, verificationToken: string) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: EMAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    } as nodemailer.TransportOptions);

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: "Verificación de Email",
      text: `Por favor, verifica tu email usando el siguiente token: ${verificationToken}`,
      html: `<p>Por favor, verifica tu email haciendo clic en el siguiente enlace: <a href="http://localhost/3002/api/verificar?token=${verificationToken}">Verificar Email</a></p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email enviado: ${info.response}`);
  } catch (error) {
    console.error(`Error al enviar el email: ${error}`);
  }
};

export default sendEmail;
