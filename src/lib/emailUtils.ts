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
        from: `"Feudjeu Corp" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email',
        text: `Click the following link to verify your email: ${verificationLink}`,
        html: `<p>Click the following link to verify your email:</p><a href="${verificationLink}">${verificationLink}</a>`,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
}


export async function sendEmailPasswordForget(email: string, token: string) {
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${token}`;

    const mailOptions = {
        from: `"Feudjeu Corp" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Reset Your Password",
        text: `Click the following link to reset your password: ${resetLink}`,
        html: `<p>Click the following link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
}