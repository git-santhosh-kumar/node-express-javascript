const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendVerificationEmail = async (to, token) => {
  const url = `${process.env.CLIENT_URL}/api/verify-email?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Verify your email',
    html: `<h3>Click to verify:</h3><a href="${url}">${url}</a>`,
  });
};
