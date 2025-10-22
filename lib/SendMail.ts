import nodemailer from "nodemailer";
export const sendMail = async (
  subject: string,
  receiver: string,
  body: string
) => {
  const transport = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  } as nodemailer.TransportOptions);

  const options = {
    from: `"Rajput Gensets & Solar" <${process.env.NODEMAILER_EMAIL}>`,
    to: receiver,
    subject: subject,
    html: body,
  };

  try {
    await transport.sendMail(options);
    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    } else {
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }
};
