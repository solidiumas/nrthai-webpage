const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const URGENCY_LABELS = {
  exploring: 'Exploring',
  this_quarter: 'This quarter',
  asap: 'ASAP',
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, company, role, problem, urgency } = req.body || {};

  if (!email || !problem) {
    return res.status(400).json({ error: 'Email and problem are required' });
  }

  const urgencyLabel = URGENCY_LABELS[urgency] || urgency || 'Not specified';

  const textBody = [
    `From: ${email}`,
    company && `Company: ${company}`,
    role && `Role: ${role}`,
    `Urgency: ${urgencyLabel}`,
    '',
    'What they want automated:',
    problem,
  ].filter(Boolean).join('\n');

  try {
    await resend.emails.send({
      // 'from' must be a verified sender/domain in your Resend account.
      // Verify nrth.no in Resend dashboard → Domains, then use any address @nrth.no.
      from: 'brief@nrth.no',
      to: 'contact@nrth.no',
      replyTo: email,
      subject: `Brief — ${company || email}`,
      text: textBody,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send brief' });
  }
};
