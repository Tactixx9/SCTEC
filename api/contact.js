const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  const body = req.body || {};
  const { name, email, message } = body;
  if (!name || !email || !message) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'Missing fields' }));
  }

  const toEmail = process.env.CONTACT_TO_EMAIL;
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (gmailUser && gmailPass && toEmail) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user: gmailUser, pass: gmailPass }
      });

      await transporter.sendMail({
        from: `${name} <${email}>`,
        to: toEmail,
        subject: `Website contact from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`
      });

      res.statusCode = 200;
      return res.end(JSON.stringify({ ok: true }));
    } catch (err) {
      console.error('Gmail SMTP send failed', err);
      res.statusCode = 502;
      return res.end(JSON.stringify({ error: 'Failed to send email (gmail)' }));
    }
  }

  // Fallback: log submission and return success so frontend UX keeps working
  console.log('Contact form submission (no mail provider configured):', { name, email, message });
  res.statusCode = 200;
  res.end(JSON.stringify({ ok: true, note: 'Logged submission; configure SMTP to send emails.' }));
};
