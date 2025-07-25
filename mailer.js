const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com',       // your Gmail address
    pass: 'your_app_password_or_gmail_password' // your Gmail app password or account password
  }
});

/**
 *Send OTP email
  @param {string} toEmail - Recipient email address
 * @param {string} otp - OTP code
 * @returns {Promise} - resolves on success, rejects on error
 */
function sendOTPEmail(toEmail, otp) {
  const mailOptions = {
    from: '"HealthAssist" <your_email@gmail.com>', // sender address
    to: toEmail,
    subject: 'Your OTP Code for HealthAssist',
    text: `Your OTP code is: ${otp}. It is valid for 5 minutes.`,
    html: `<p>Your OTP code is: <b>${otp}</b></p><p>This code is valid for 5 minutes.</p>`
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending mail:', error);
        reject(error);
      } else {
        console.log('Email sent: ' + info.response);
        resolve(info);
      }
    });
  });
}

module.exports = sendOTPEmail;
