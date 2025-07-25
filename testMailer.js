const sendOTPEmail = require('./mailer');

const testEmail = 'binayaknaudiagenaisj@gmail.com';  // replace with your email
const testOTP = '123456';

sendOTPEmail(testEmail, testOTP)
  .then(() => {
    console.log('Test email sent successfully!');
  })
  .catch((err) => {
    console.error('Failed to send test email:', err);
  });
