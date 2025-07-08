import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import dotenv from "dotenv";
import { capitalize } from "../utils/helper.js";
import { ApiError } from "../utils/ApiError.js";

dotenv.config();

// Mailgen config
const mailGenerator = new Mailgen({
      theme: "default",
      product: {
            name: "Rajput Genset and Solars",
            link: process.env.CLIENT_URL,
      },
});

// Nodemailer transporter using Mailtrap SMTP
const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
            user: process.env.MAILTRAP_USERNAME,
            pass: process.env.MAILTRAP_PASSWORD,
      },
});

const sendMail = async (email, subject, content) => {
      const html = mailGenerator.generate(content);
      const text = mailGenerator.generatePlaintext(content);

      try {
            await transporter.sendMail({
                  from: `"Rajput Genset and Solars" <${process.env.MAILTRAP_SENDERMAIL}>`,
                  to: email,
                  subject,
                  text,
                  html,
            });
      } catch (error) {
            console.error("SMTP sendMail error:", error); // 🔍 Detailed error log
            throw new ApiError(500, `Failed to send "${subject}" email.`);
      }
};

// Email template: Verify Email
const emailVerificationMailContent = (fullName, link) => ({
      body: {
            name: fullName,
            intro: "Welcome to Rajput Genset and Solars! We're excited to have you on board.",
            action: {
                  instructions: "To complete your registration, please verify your email by clicking the button below:",
                  button: {
                        color: "#22BC66",
                        text: "Verify Email",
                        link: link,
                  },
            },
            outro: "If you have any questions or need support, just reply to this email—we're here to help!",
            signature: false,
      },
});

// Email template: Reset Password
const resetPasswordMailContent = (fullName, link) => ({
      body: {
            name: fullName,
            intro: "It seems like you requested a password reset.",
            action: {
                  instructions: "To reset your password, click the button below:",
                  button: {
                        color: "#FF613C",
                        text: "Reset Password",
                        link: link,
                  },
            },
            outro: "If you didn't request this, please ignore this email, or contact support if you have concerns.",
            signature: false,
      },
});

// Public function: Send verification email
const sendVerificationMail = async (fullName, email, token) => {
      const link = `${process.env.CLIENT_URL}/verify-email/${token}`;
      const capitalName = capitalize(fullName);
      await sendMail(email, "Verify Your Email", emailVerificationMailContent(capitalName, link));
};

// Public function: Send reset password email
const sendResetPasswordMail = async (fullName, email, token) => {
      const link = `${process.env.CLIENT_URL}/reset-password/${token}`;
      const capitalName = capitalize(fullName);
      await sendMail(email, "Reset Your Password", resetPasswordMailContent(capitalName, link));
};

export { sendVerificationMail, sendResetPasswordMail };

// import Mailgen from "mailgen";
// import dotenv from "dotenv";
// import { capitalize } from "../utils/helper.js";
// import { MailtrapClient } from "mailtrap";
// import { ApiError } from "../utils/ApiError.js";

// dotenv.config();

// const mailGenerator = new Mailgen({
//       theme: "default",
//       product: {
//             name: "Rajput Genset and Solars",
//             link: process.env.CLIENT_URL,
//       },
// });

// const client = new MailtrapClient({
//       token: process.env.MAILTRAP_TOKEN,
// });

// const sendMail = async (email, subject, content) => {
//       const html = mailGenerator.generate(content);
//       const text = mailGenerator.generatePlaintext(content);

//       const sender = {
//             email: process.env.MAILTRAP_SENDERMAIL,
//             name: "Rajput Genset and Solars",
//       };

//       const recipients = [{ email }];

//       try {
//             await client.send({
//                   from: sender,
//                   to: recipients,
//                   subject,
//                   text,
//                   html,
//             });
//       } catch (error) {
//             throw new ApiError(500, `Failed to send "${subject}" email.`);
//       }
// };

// const emailVerificationMailContent = (fullName, link) => {
//       return {
//             body: {
//                   name: fullName,
//                   intro: "Welcome to Rajput Genset and Solars! We're excited to have you on board.",
//                   action: {
//                         instructions:
//                               "To complete your registration, please verify your email by clicking the button below:",
//                         button: {
//                               color: "#22BC66",
//                               text: "Verify Email",
//                               link: link,
//                         },
//                   },
//                   outro:
//                         "If you have any questions or need support, just reply to this email—we're here to help!",
//                   signature: false,
//             },
//       };
// };

// const resetPasswordMailContent = (fullName, link) => {
//       return {
//             body: {
//                   name: fullName,
//                   intro: "It seems like you requested a password reset.",
//                   action: {
//                         instructions: "To reset your password, click the button below:",
//                         button: {
//                               color: "#FF613C",
//                               text: "Reset Password",
//                               link: link,
//                         },
//                   },
//                   outro:
//                         "If you didn't request this, please ignore this email, or contact support if you have concerns.",
//                   signature: false,
//             },
//       };
// };

// const sendVerificationMail = async (fullName, email, token) => {
//       const link = `${process.env.CLIENT_URL}/verify-email/${token}`;
//       const capitalName = capitalize(fullName);
//       await sendMail(email, "Verify Your Email", emailVerificationMailContent(capitalName, link));
// };

// const sendResetPasswordMail = async (fullName, email, token) => {
//       const link = `${process.env.CLIENT_URL}/reset-password/${token}`;
//       const capitalName = capitalize(fullName);
//       await sendMail(email, "Reset Your Password", resetPasswordMailContent(capitalName, link));
// };

// export { sendVerificationMail, sendResetPasswordMail };
