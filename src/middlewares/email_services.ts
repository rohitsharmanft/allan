import path from "path";
import fs from "fs";
import sendEmailNodemailer from "./nodemailerEmail";
import { captureRejectionSymbol } from "events";
import { config } from "dotenv";
config();

const frontendUrl=process.env.FRONTEND_URL

const adminForgetPasswordMail = async (data: any) => {
  try {
    let { email, resetToken, fullName } = data;
    let subject = "Reset Password";
    let file_path = path.join(
      __dirname,
      "../email_templates/admin_forgot_password.html",
    );
    let html = await fs.readFileSync(file_path, { encoding: "utf-8" });
    html = html.replace("%USER_NAME%", fullName || email);
    html = html.replace("%RESET_TOKEN%", resetToken);
    html = html.replace("%FRONTEND_URL%", frontendUrl);
    await sendEmailNodemailer(email, subject, html);
  } catch (err) {
    throw err;
  }
};
const memberForgetPasswordMail = async (data: any) => {
  try {
    let { email, resetToken, fullName } = data;
    let subject = "Reset Password";
    let file_path = path.join(
      __dirname,
      "../email_templates/member_forgot_password.html",
    );
    let html = await fs.readFileSync(file_path, { encoding: "utf-8" });
    html = html.replace("%USER_NAME%", fullName || email);
    html = html.replace("%RESET_TOKEN%", resetToken);
      html = html.replace("%FRONTEND_URL%", frontendUrl);
    await sendEmailNodemailer(email, subject, html);
  } catch (err) {
    throw err;
  }
};
const userForgetPasswordMail = async (data: any) => {
  try {
    let { email, resetToken, fullName } = data;
    let subject = "Reset Password";
    let file_path = path.join(
      __dirname,
      "../email_templates/user_forgot_password.html",
    );
    let html = await fs.readFileSync(file_path, { encoding: "utf-8" });
    html = html.replace("%USER_NAME%", fullName || email);
    html = html.replace("%RESET_TOKEN%", resetToken);
      html = html.replace("%FRONTEND_URL%", frontendUrl);
    await sendEmailNodemailer(email, subject, html);
  } catch (err) {
    throw err;
  }
};
const memberApplicationMail = async (data: any) => {
  try {
    const { email, fullName, reason, loginLink } = data;
    console.log("helll", loginLink);
    let subject = "Sign Up Accepted";
    let file_path = path.join(
      __dirname,
      "../email_templates/registration_approval.html",
    );
    let html = await fs.readFileSync(file_path, { encoding: "utf-8" });
    html = html.replace("%USER_NAME%", fullName || email);
    html = html.replace("%LOGIN_LINK%", loginLink);
    html = html.replace("%REASON%", reason);
    await sendEmailNodemailer(email, subject, html);
  } catch (error) {
    throw error;
  }
};
const memberApplicationRejectedMail = async (data: any) => {
  try {
    const { email, fullName, reason } = data;
    let subject = "Reject Aplication";
    let file_path = path.join(
      __dirname,
      "../email_templates/member_application_reject.html",
    );
    let html = await fs.readFileSync(file_path, { encoding: "utf-8" });
    html = html.replace("%USER_NAME%", fullName || email);
    html = html.replace("%REASON%", reason);
    await sendEmailNodemailer(email, subject, html);
  } catch (error) {
    throw error;
  }
};
const clientActionInQuote = async (data: any) => {
  try {
    const { email, fullName, type } = data;
    let subject = `Quote ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    let file_path = path.join(
      __dirname,
      "../email_templates/client_action_in_quote.html",
    );
    let html = await fs.readFileSync(file_path, { encoding: "utf-8" });
    html = html.replace("%USER_NAME%", fullName || email);
    html = html.replace(/%TYPE%/g, type);
    await sendEmailNodemailer(email, subject, html);
  } catch (error) {
    throw error;
  }
};
const adminActionInClientRegistration = async (data: any) => {
  try {
    const { email, fullName, type } = data;
    let subject = `Application ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    let file_path = path.join(
      __dirname,
      "../email_templates/client_registration_approval.html",
    );
    let html = await fs.readFileSync(file_path, { encoding: "utf-8" });
    html = html.replace("%USER_NAME%", fullName || email);
    //  html = html.replace("%MEMBER_NAME%", fullName);
    html = html.replace(/%TYPE%/g, type);
    await sendEmailNodemailer(email, subject, html);
  } catch (error) {
    throw error;
  }
};

const contactUsEmail = async (data: any) => {
  try {
    let { name, email, contact_no, message } = data;
    let subject = "User try to contact you";
    let file_path = path.join(
      __dirname,
      "../email_templates/contact_us_email.html",
    );
    let html = await fs.readFileSync(file_path, { encoding: "utf-8" });
    html = html.replace("%NAME%", name);
    html = html.replace("%EMAIL%", email);
    html = html.replace("%MESSAGE%", message);
    html = html.replace("%CONTACT_NO%", contact_no);
    html = html.replace("%CONTACT_NO%", process.env.ADMIN_EMAIL);

    await sendEmailNodemailer(process.env.ADMIN_EMAIL, subject, html);
  } catch (err) {
    throw err;
  }
};

const sendOTP = async (data: any) => {
  try {
    let { email, otp, fullName } = data;
    let subject = "Email Verification";
    let file_path = path.join(__dirname, "../email_templates/otp_temp.html");
    let html = await fs.readFileSync(file_path, { encoding: "utf-8" });
    html = html.replace("%EMAIL%", email);
    html = html.replace("%FULL_NAME%", fullName || email);
    html = html.replace("%OTP%", otp);
    await sendEmailNodemailer(email, subject, html);
  } catch (err) {
    throw err;
  }
};

const welcomeMail = async (data: any) => {
  try {
    let { email, full_name } = data;
    let subject = "AI-Powered Presentation Maker";
    let file_path = path.join(
      __dirname,
      "../email_templates/welcome_email.html",
    );
    let html = await fs.readFileSync(file_path, { encoding: "utf-8" });
    html = html.replace("%USER_NAME%", full_name ?? email);
    await sendEmailNodemailer(email, subject, html);
  } catch (err) {
    throw err;
  }
};

const paymentSuccessMail = async (data: any) => {
  try {
    const {
      email,
      fullName,
      transactionId,
      paymentDate,
      planName,
      amount,
      paymentMethod,
      dashboardLink,
      companyName,
    } = data;

    let subject = "Payment Successful";

    let file_path = path.join(
      __dirname,
      "../email_templates/payment_success_mail.html",
    );

    let html = fs.readFileSync(file_path, { encoding: "utf-8" });

    html = html.replace("%USER_NAME%", fullName || email);
    html = html.replace("%TRANSACTION_ID%", transactionId);
    html = html.replace("%PAYMENT_DATE%", paymentDate);
    html = html.replace("%PLAN_NAME%", planName);
    html = html.replace("%AMOUNT%", amount);
    html = html.replace("%PAYMENT_METHOD%", paymentMethod);
    // html = html.replace("%DASHBOARD_LINK%", dashboardLink);
    html = html.replace("%COMPANY_NAME%", companyName);
    html = html.replace("%YEAR%", new Date().getFullYear().toString());

    await sendEmailNodemailer(email, subject, html);
  } catch (error) {
    throw error;
  }
};

const quoteCreatedMail = async (data: any) => {
  try {
    const {
      email,
      jobCreatorName,
      memberName,
      memberEmail,
      jobTitle,
      description,
      membershipType,
      createdAt,
      fileUrl,
      jobLink,
      companyName,
    } = data;

    const subject = "New Quote Received";

    const file_path = path.join(
      __dirname,
      "../email_templates/quote_created_mail.html",
    );

    let html = fs.readFileSync(file_path, { encoding: "utf-8" });

    const replacements: Record<string, string> = {
      JOB_CREATOR_NAME: jobCreatorName || email,
      MEMBER_NAME: memberName || "A member",
      MEMBER_EMAIL: memberEmail || "",
      JOB_TITLE: jobTitle,
      QUOTE_DESCRIPTION: description,
      MEMBERSHIP_TYPE: membershipType || "N/A",
      CREATED_AT: createdAt,
      FILE_URL: fileUrl || "",
      JOB_LINK: jobLink,
      COMPANY_NAME: companyName,
      YEAR: new Date().getFullYear().toString(),
    };

    for (const key in replacements) {
      const regex = new RegExp(`%${key}%`, "g");
      html = html.replace(regex, replacements[key]);
    }
    if (!fileUrl) {
      html = html.replace(/%IF_FILE%[\s\S]*%END_IF_FILE%/g, "");
    } else {
      html = html.replace(/%IF_FILE%/g, "").replace(/%END_IF_FILE%/g, "");
    }

    await sendEmailNodemailer(email, subject, html);
  } catch (error) {
    console.error("Error sending quote email:", error);
    throw error;
  }
};
const memberQuoteConfirmationMail = async (data: any) => {
  try {
    const {
      email,
      memberName,
      clientName,
      jobTitle,
      description,
      membershipType,
      createdAt,
      fileUrl,
      dashboardLink,
      companyName,
    } = data;

    const subject = "Your Application Has Been Submitted Successfully";

    const file_path = path.join(
      __dirname,
      "../email_templates/member_quote_confirmation_mail.html",
    );

    let html = fs.readFileSync(file_path, { encoding: "utf-8" });

    const replacements: Record<string, string> = {
      MEMBER_NAME: memberName || "Member",
      CLIENT_NAME: clientName || "Client",
      JOB_TITLE: jobTitle,
      QUOTE_DESCRIPTION: description,
      MEMBERSHIP_TYPE: membershipType || "N/A",
      CREATED_AT: createdAt,
      FILE_URL: fileUrl || "",
      DASHBOARD_LINK: dashboardLink,
      COMPANY_NAME: companyName,
      YEAR: new Date().getFullYear().toString(),
    };

    for (const key in replacements) {
      const regex = new RegExp(`%${key}%`, "g");
      html = html.replace(regex, replacements[key]);
    }

    if (!fileUrl) {
      html = html.replace(/%IF_FILE%[\s\S]*%END_IF_FILE%/g, "");
    } else {
      html = html.replace(/%IF_FILE%/g, "").replace(/%END_IF_FILE%/g, "");
    }

    await sendEmailNodemailer(email, subject, html);
  } catch (error) {
    console.error("Error sending member quote confirmation email:", error);
    throw error;
  }
};

const jobCreateMail = async (data: any) => {
  try {
    const {
      title,
      email,
      userName,
      type,
      category,
      skill,
      city,
      location,
      startDate,
      closingDate,
    } = data;

    // const subject = `New ${type} Received`;
    const subject = `New ${type.charAt(0).toUpperCase() + type.slice(1)} Received`;

    const file_path = path.join(__dirname, "../email_templates/job_mail.html");

    let html = fs.readFileSync(file_path, { encoding: "utf-8" });
    html = html.replace("%JOB_TITLE%", title);
    html = html.replace("%CLIENT_NAME%", userName);
    html = html.replace(/%JOB_TYPE%/g, type);
    html = html.replace("%CATEGORY%", category);
    html = html.replace("%CITY%", city);
    html = html.replace("%LOCATION%", location);
    html = html.replace("%START_DATE%", startDate);
    html = html.replace("%CLOSE_DATE%", closingDate);
    await sendEmailNodemailer(email, subject, html);
  } catch (error) {
    throw error;
  }
};

export default quoteCreatedMail;

export {
  adminForgetPasswordMail,
  memberForgetPasswordMail,
  userForgetPasswordMail,
  contactUsEmail,
  sendOTP,
  welcomeMail,
  memberApplicationRejectedMail,
  clientActionInQuote,
  memberApplicationMail,
  adminActionInClientRegistration,
  paymentSuccessMail,
  quoteCreatedMail,
  jobCreateMail,
  memberQuoteConfirmationMail,
};
