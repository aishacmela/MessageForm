require('dotenv').config({ path: './.env' });
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Console } = require('console');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = ['http://localhost:5500', 'http://127.0.0.1:5500'];

// Middleware
app.use(cors({
    origin: allowedOrigins,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5500'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Configure Nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.mail.me.com', // iCloud SMTP server
    port: 587, // Port for TLS
    secure: false, // Use TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
console.log('Email User:', process.env.EMAIL_USER || 'Not set');
console.log('Email Pass:', process.env.EMAIL_PASS ? 'Set' : 'Not set');
console.log('Recipient Email:', process.env.RECIPIENT_EMAIL || 'Not set');


// POST endpoint to send the email
app.post('/send-email', async (req, res) => {
  const { email, name, subject, message } = req.body;

  if (!email || !name || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECIPIENT_EMAIL,
    subject: `New Portfolio Message from ${name}`,
    text: `From: ${name} (${email})\n\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending email' });
  }
});

app.listen(PORT, () => {
    console.log(`servver is running on http://localhost:${PORT}`)
});