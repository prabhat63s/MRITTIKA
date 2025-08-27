import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", // or "smtp"
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"MyApp Support" <${process.env.SMTP_EMAIL}>`,
            to,
            subject,
            text,
            html,
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (err) {
        console.error("Email error:", err.message);
        return false;
    }
};
