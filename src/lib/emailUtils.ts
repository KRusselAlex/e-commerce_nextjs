import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.SMTP_SERVER_HOST,
    port: 587,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendVerificationEmail(email: string, token: string) {
    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-email?token=${token}`;

    const mailOptions = {
        from: `"A'space" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email',
        text: `Click the following link to verify your email: ${verificationLink}`,
        html: `<p>Click the following link to verify your email:</p><a href="${verificationLink}">${verificationLink}</a>`,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
}
