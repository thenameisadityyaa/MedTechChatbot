const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// 🟡 Send OTP
router.post("/send-otp", (req, res) => {
  const { contact } = req.body;
  const otp = generateOTP();
  const expiry = new Date(Date.now() + 5 * 60000); // 5 min

  const field = contact.includes("@") ? "email" : "phone";

  db.query(`SELECT * FROM users WHERE ${field} = ?`, [contact], (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.length > 0) {
      db.query(`UPDATE users SET otp_code=?, otp_expiry=? WHERE ${field}=?`, [otp, expiry, contact]);
    } else {
      db.query(`INSERT INTO users (${field}, otp_code, otp_expiry) VALUES (?, ?, ?)`, [contact, otp, expiry]);
    }

    // Send OTP via console or email
    console.log("Generated OTP:", otp);

    // TODO: You can integrate nodemailer here to email the OTP

    res.json({ status: true, message: "OTP sent", otp });
  });
});

// 🟢 Verify OTP
router.post("/verify-otp", (req, res) => {
  const { contact, otp } = req.body;
  const field = contact.includes("@") ? "email" : "phone";

  const sql = `SELECT * FROM users WHERE ${field} = ? AND otp_code = ? AND otp_expiry > NOW()`;

  db.query(sql, [contact, otp], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length > 0) {
      db.query(`UPDATE users SET is_verified = 1 WHERE ${field} = ?`, [contact]);
      return res.json({ status: true, message: "OTP verified" });
    } else {
      return res.json({ status: false, message: "Invalid or expired OTP" });
    }
  });
});

// ✅ Complete Signup
router.post("/signup", async (req, res) => {
  const { contact, username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const field = contact.includes("@") ? "email" : "phone";

  const sql = `UPDATE users SET username=?, password_hash=? WHERE ${field}=?`;

  db.query(sql, [username, hash, contact], (err) => {
    if (err) return res.status(500).send(err);
    return res.json({ status: true, message: "User registered successfully" });
  });
});

// 🔐 Login
router.post("/login", (req, res) => {
  const { login_id, password } = req.body;

  const sql = `SELECT * FROM users WHERE (username=? OR email=? OR phone=?) AND is_verified=1`;
  db.query(sql, [login_id, login_id, login_id], async (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.json({ status: false, message: "User not found or not verified" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (match) {
      res.json({ status: true, message: "Login successful", user });
    } else {
      res.json({ status: false, message: "Incorrect password" });
    }
  });
});

module.exports = router;
