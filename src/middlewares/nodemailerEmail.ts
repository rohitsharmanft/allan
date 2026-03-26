import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import { config } from "dotenv";

config();
const nodemailer_email = process.env.NODEMAILER_MAIL;
const nodemailer_password = process.env.NODEMAILER_PASSWORD;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: nodemailer_email,
    pass: nodemailer_password,
  },
});

const sendEmailNodemailer = async (to: string, subject: string, body: any) => {
  try {
    console.log({ nodemailer_email });
    let mailOptions = {
      from: nodemailer_email,
      to: to,
      subject: subject,
      html: body,
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (err) {
    // throw err;
    console.log(err);
  }
};

export default sendEmailNodemailer;

// const mailOption = {
//   from: `${config.appName} <${config.email}>`,
//   to: email,
//   subject: subject,
//   html: data,
// };
