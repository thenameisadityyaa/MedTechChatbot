// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const sendOTPEmail = require('./mailer');
const db = require('./db'); // MySQL connection

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Temporary in-memory OTP store
const otpStore = {};

// =================== SEND OTP ===================
app.post('/send-otp', async (req, res) => {
  const { contact } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contact)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[contact] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 min
  };

  try {
    await sendOTPEmail(contact, otp);
    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// =================== VERIFY OTP ===================
app.post('/verify-otp', (req, res) => {
  const { contact, otp } = req.body;

  if (!otpStore[contact]) {
    return res.status(400).json({ error: 'No OTP sent for this contact' });
  }

  const saved = otpStore[contact];

  if (Date.now() > saved.expiresAt) {
    delete otpStore[contact];
    return res.status(400).json({ error: 'OTP expired' });
  }

  if (otp !== saved.otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  delete otpStore[contact];
  res.json({ message: 'OTP verified successfully' });
});

// =================== REGISTER USER ===================
app.post('/register', async (req, res) => {
  const { contact, username, password } = req.body;

  if (!username || !password || !contact) {
    return res.status(400).json({ success: false, error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    let email = null;
    let phone = null;
    if (/^\d{10}$/.test(contact)) {
      phone = contact;
    } else {
      email = contact;
    }

    const query = "INSERT INTO users (username, email, phone, password) VALUES (?, ?, ?, ?)";
    db.query(query, [username, email, phone, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ success: false, error: "Username or contact already exists" });
        }
        console.error(err);
        return res.status(500).json({ success: false, error: "Database error" });
      }
      return res.json({ success: true, message: "User registered successfully" });
    });
  } catch (err) {
    console.error("Error hashing password:", err);
    return res.status(500).json({ success: false, error: "Internal error" });
  }
});

// =================== LOGIN USER ===================
app.post('/login', (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(400).json({ success: false, error: "All fields are required" });
  }

  const query = `
    SELECT * FROM users 
    WHERE username = ? OR email = ? OR phone = ?
    LIMIT 1
  `;

  db.query(query, [id, id, id], async (err, results) => {
    if (err) {
      console.error("DB error during login:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ success: false, error: "Incorrect password" });
    }

    res.json({ success: true, message: "Login successful", username: user.username });
  });
});

// =================== START SERVER ===================
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
