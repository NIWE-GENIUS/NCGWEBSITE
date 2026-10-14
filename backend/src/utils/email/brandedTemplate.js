// backend/src/utils/email/brandedTemplate.js
// Every NCG email uses this branded wrapper.

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Logo — served from frontend public folder
const LOGO_URL = `${FRONTEND_URL}/logo.png`;

// Simple-icons CDN (real brand SVGs)
const ICONS_CDN = 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons';

const SOCIALS = {
  linkedin: { url: 'https://linkedin.com/company/nextcreaturesgroup', icon: `${ICONS_CDN}/linkedin.svg`, bg: '#0A66C2' },
  twitter: { url: 'https://twitter.com/nextcreatures', icon: `${ICONS_CDN}/x.svg`, bg: '#000000' },
  instagram: { url: 'https://instagram.com/nextcreaturesgroup', icon: `${ICONS_CDN}/instagram.svg`, bg: '#E4405F' },
  facebook: { url: 'https://facebook.com/nextcreaturesgroup', icon: `${ICONS_CDN}/facebook.svg`, bg: '#1877F2' },
  youtube: { url: 'https://youtube.com/@nextcreaturesgroup', icon: `${ICONS_CDN}/youtube.svg`, bg: '#FF0000' },
  github: { url: 'https://github.com/nextcreaturesgroup', icon: `${ICONS_CDN}/github.svg`, bg: '#181717' },
  tiktok: { url: 'https://tiktok.com/@nextcreaturesgroup', icon: `${ICONS_CDN}/tiktok.svg`, bg: '#000000' },
};

/**
 * Wrap any HTML content in the NCG branded email shell.
 */
function wrapBranded(content, { preheader = '' } = {}) {
  const socialButtons = Object.values(SOCIALS)
    .map(
      (s) => `
      <td style="padding:0 4px;">
        <a href="${s.url}" target="_blank" style="display:inline-block;width:40px;height:40px;background:${s.bg};border-radius:8px;text-decoration:none;text-align:center;">
          <img src="${s.icon}" alt="" width="20" height="20" style="display:block;margin:10px auto;filter:brightness(0) invert(1);" />
        </a>
      </td>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NEXT Creatures Group Ltd</title>
<style>
  body, table, td, p, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
  img { -ms-interpolation-mode:bicubic; border:0; height:auto; line-height:100%; outline:none; text-decoration:none; }
  body { margin:0; padding:0; width:100% !important; background:#F5F9FB; font-family:'DM Sans',Arial,sans-serif; }
</style>
</head>
<body style="margin:0;padding:0;background:#F5F9FB;font-family:'DM Sans',Arial,sans-serif;color:#163247;">

  <!-- Preheader (hidden) -->
  <div style="display:none;font-size:1px;color:#F5F9FB;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F9FB;padding:24px 12px;">
    <tr><td align="center">

      <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(6,75,122,0.08);">

        <!-- HEADER with logo -->
        <tr>
          <td style="background:linear-gradient(135deg,#064B7A 0%,#062F4A 60%,#031B2A 100%);padding:32px 32px 28px 32px;text-align:center;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center" style="padding-bottom:16px;">
                <div style="background:#FFFFFF;display:inline-block;padding:10px 16px;border-radius:12px;">
                  <img src="${LOGO_URL}" alt="NEXT Creatures Group Ltd" width="160" style="display:block;max-width:160px;height:auto;" />
                </div>
              </td></tr>
              <tr><td align="center">
                <h1 style="margin:0;color:#FFFFFF;font-family:'Space Grotesk',Arial,sans-serif;font-size:22px;font-weight:700;letter-spacing:0.3px;">
                  NEXT Creatures Group Ltd
                </h1>
                <p style="margin:6px 0 0 0;color:#8BCB2A;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
                  Smart Solutions For Digital Future
                </p>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- BODY -->
        <tr><td style="padding:36px 40px 28px 40px;">
          ${content}
        </td></tr>

        <!-- NEWSLETTER SUBSCRIBE CTA -->
        <tr><td style="padding:0 40px 24px 40px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F9FB;border-radius:12px;">
            <tr><td align="center" style="padding:20px;">
              <p style="margin:0 0 8px 0;font-family:'Space Grotesk',Arial,sans-serif;font-size:15px;font-weight:700;color:#031B2A;">
                Stay in the loop
              </p>
              <p style="margin:0 0 16px 0;font-size:13px;color:#6D7E89;line-height:1.5;">
                Get updates about new programs, projects, and opportunities from NCG.
              </p>
              <a href="${FRONTEND_URL}/newsletter?email={{email}}" style="display:inline-block;background:#8BCB2A;color:#031B2A;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:700;font-size:14px;">
                Subscribe to Updates
              </a>
            </td></tr>
          </table>
        </td></tr>

        <!-- SOCIAL LINKS -->
        <tr><td style="padding:0 40px 32px 40px;" align="center">
          <p style="margin:0 0 12px 0;font-size:11px;font-weight:700;color:#6D7E89;letter-spacing:2px;text-transform:uppercase;">
            Follow NEXT Creatures Group
          </p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr>
              ${socialButtons}
            </tr>
          </table>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#031B2A;padding:24px 32px;text-align:center;">
          <p style="margin:0 0 6px 0;font-size:13px;color:#FFFFFF;font-weight:700;">
            NEXT Creatures Group Ltd
          </p>
          <p style="margin:0 0 12px 0;font-size:11px;color:#A8BBC5;">
            Kigali, Rwanda · info@nextcreaturesgroup.com · +250 788 123 456
          </p>
          <p style="margin:0 0 12px 0;font-size:11px;">
            <a href="${FRONTEND_URL}/legal/privacy" style="color:#8BCB2A;text-decoration:none;margin:0 8px;">Privacy</a>
            <span style="color:#A8BBC5;">·</span>
            <a href="${FRONTEND_URL}/legal/terms" style="color:#8BCB2A;text-decoration:none;margin:0 8px;">Terms</a>
            <span style="color:#A8BBC5;">·</span>
            <a href="${FRONTEND_URL}/newsletter/unsubscribe?email={{email}}" style="color:#8BCB2A;text-decoration:none;margin:0 8px;">Unsubscribe</a>
          </p>
          <p style="margin:0;font-size:10px;color:#6D7E89;">
            © ${new Date().getFullYear()} NEXT Creatures Group Ltd. All rights reserved.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/**
 * Content blocks for common email types.
 */
const CONTENT = {
  contactAutoReply: ({ name, messageId }) => `
    <h2 style="margin:0 0 16px 0;font-family:'Space Grotesk',Arial,sans-serif;font-size:24px;color:#031B2A;">
      Thank you, ${name}!
    </h2>
    <p style="font-size:15px;line-height:1.7;color:#163247;margin:0 0 14px 0;">
      We received your message and our team will respond within <strong>24–48 hours</strong>.
    </p>
    <div style="background:#F5F9FB;border-left:4px solid #8BCB2A;padding:16px 20px;border-radius:8px;margin:20px 0;">
      <p style="margin:0;font-size:13px;color:#6D7E89;">Your reference number</p>
      <p style="margin:4px 0 0 0;font-family:'Courier New',monospace;font-size:16px;color:#064B7A;font-weight:700;">${messageId}</p>
    </div>
    <p style="font-size:15px;line-height:1.7;color:#163247;margin:0 0 14px 0;">
      In the meantime, feel free to explore our
      <a href="${FRONTEND_URL}/programs" style="color:#064B7A;font-weight:600;">programs</a> or
      <a href="${FRONTEND_URL}/collaboration" style="color:#064B7A;font-weight:600;">collaboration opportunities</a>.
    </p>
    <p style="font-size:15px;line-height:1.7;color:#163247;margin:20px 0 0 0;">
      Warm regards,<br>
      <strong>The NCG Team</strong>
    </p>
  `,

  contactAdminNotification: ({ name, email, phone, organization, purpose, subject, message, messageId, source }) => `
    <h2 style="margin:0 0 20px 0;font-family:'Space Grotesk',Arial,sans-serif;font-size:22px;color:#031B2A;">
      New Contact Message
    </h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#163247;">
      <tr><td style="padding:8px 0;border-bottom:1px solid #EDF2F5;"><strong style="color:#6D7E89;font-size:12px;text-transform:uppercase;letter-spacing:1px;">From</strong><br>${name}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #EDF2F5;"><strong style="color:#6D7E89;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Email</strong><br><a href="mailto:${email}" style="color:#064B7A;">${email}</a></td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #EDF2F5;"><strong style="color:#6D7E89;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Phone</strong><br>${phone || '—'}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #EDF2F5;"><strong style="color:#6D7E89;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Organization</strong><br>${organization || '—'}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #EDF2F5;"><strong style="color:#6D7E89;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Purpose</strong><br><span style="display:inline-block;padding:3px 10px;background:#8BCB2A;color:#031B2A;border-radius:20px;font-size:12px;font-weight:700;text-transform:capitalize;">${purpose}</span></td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #EDF2F5;"><strong style="color:#6D7E89;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Subject</strong><br>${subject || '—'}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #EDF2F5;"><strong style="color:#6D7E89;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Source Page</strong><br>${source || 'website'}</td></tr>
      <tr><td style="padding:8px 0;"><strong style="color:#6D7E89;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Message ID</strong><br><code style="font-family:'Courier New',monospace;font-size:13px;color:#064B7A;">${messageId}</code></td></tr>
    </table>
    <div style="background:#F5F9FB;border-left:4px solid #8BCB2A;padding:20px;border-radius:8px;margin:24px 0;">
      <p style="margin:0 0 6px 0;font-size:12px;color:#6D7E89;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Message</p>
      <p style="margin:0;font-size:15px;line-height:1.7;color:#163247;white-space:pre-wrap;">${message}</p>
    </div>
    <p style="text-align:center;margin:24px 0 0 0;">
      <a href="${FRONTEND_URL}/admin/messages" style="display:inline-block;background:#064B7A;color:#FFFFFF;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:700;font-size:14px;">
        Open Admin Inbox
      </a>
    </p>
  `,

  welcome: ({ firstName }) => `
    <h2 style="margin:0 0 16px 0;font-family:'Space Grotesk',Arial,sans-serif;font-size:24px;color:#031B2A;">
      Welcome to NCG, ${firstName}!
    </h2>
    <p style="font-size:15px;line-height:1.7;color:#163247;margin:0 0 14px 0;">
      We're excited to have you join the NEXT Creatures Group ecosystem — Rwanda's home for technology, innovation, and engineering.
    </p>
    <p style="font-size:15px;line-height:1.7;color:#163247;margin:0 0 14px 0;">
      Here's what you can do next:
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
      <tr><td style="padding:10px 0;"><strong style="color:#064B7A;">Explore Programs</strong> — Bootcamps, internships, and courses in tech.</td></tr>
      <tr><td style="padding:10px 0;"><strong style="color:#064B7A;">Collaborate</strong> — Partner with NCG on innovation projects.</td></tr>
      <tr><td style="padding:10px 0;"><strong style="color:#064B7A;">Get Support</strong> — Reach our team anytime.</td></tr>
    </table>
    <p style="text-align:center;margin:24px 0 0 0;">
      <a href="${FRONTEND_URL}/dashboard" style="display:inline-block;background:#8BCB2A;color:#031B2A;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:14px;">
        Go to Your Dashboard
      </a>
    </p>
  `,

  verification: ({ firstName, verificationUrl }) => `
    <h2 style="margin:0 0 16px 0;font-family:'Space Grotesk',Arial,sans-serif;font-size:24px;color:#031B2A;">
      Verify your email
    </h2>
    <p style="font-size:15px;line-height:1.7;color:#163247;margin:0 0 14px 0;">
      Hi ${firstName}, please verify your email to activate your NCG account.
    </p>
    <p style="font-size:15px;line-height:1.7;color:#163247;margin:0 0 14px 0;">
      This link expires in <strong>24 hours</strong>.
    </p>
    <p style="text-align:center;margin:28px 0;">
      <a href="${verificationUrl}" style="display:inline-block;background:#064B7A;color:#FFFFFF;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:14px;">
        Verify Email
      </a>
    </p>
    <p style="font-size:12px;color:#6D7E89;margin:0;word-break:break-all;">
      Or copy this link:<br>
      <span style="color:#064B7A;">${verificationUrl}</span>
    </p>
  `,

  passwordReset: ({ firstName, resetUrl }) => `
    <h2 style="margin:0 0 16px 0;font-family:'Space Grotesk',Arial,sans-serif;font-size:24px;color:#031B2A;">
      Reset your password
    </h2>
    <p style="font-size:15px;line-height:1.7;color:#163247;margin:0 0 14px 0;">
      Hi ${firstName}, we received a request to reset your NCG password.
    </p>
    <p style="font-size:15px;line-height:1.7;color:#163247;margin:0 0 14px 0;">
      This link expires in <strong>1 hour</strong>.
    </p>
    <p style="text-align:center;margin:28px 0;">
      <a href="${resetUrl}" style="display:inline-block;background:#064B7A;color:#FFFFFF;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:14px;">
        Reset Password
      </a>
    </p>
    <p style="font-size:13px;color:#6D7E89;margin:16px 0 0 0;">
      If you didn't request this, ignore this email — your password won't change.
    </p>
  `,

  newsletterWelcome: ({ email }) => `
    <h2 style="margin:0 0 16px 0;font-family:'Space Grotesk',Arial,sans-serif;font-size:24px;color:#031B2A;">
      You're subscribed!
    </h2>
    <p style="font-size:15px;line-height:1.7;color:#163247;margin:0 0 14px 0;">
      Thank you for subscribing to NCG updates. You'll now receive:
    </p>
    <ul style="font-size:15px;line-height:1.9;color:#163247;padding-left:20px;margin:0 0 14px 0;">
      <li>New programs and course launches</li>
      <li>Project announcements and case studies</li>
      <li>Innovation and technology insights from Rwanda & Africa</li>
      <li>Collaboration and funding opportunities</li>
    </ul>
    <p style="font-size:15px;line-height:1.7;color:#163247;margin:0 0 14px 0;">
      <strong>Subscribed email:</strong> ${email}
    </p>
    <p style="text-align:center;margin:24px 0 0 0;">
      <a href="${FRONTEND_URL}" style="display:inline-block;background:#8BCB2A;color:#031B2A;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:14px;">
        Visit Our Website
      </a>
    </p>
  `,

  broadcast: ({ subject, content, recipientName }) => `
    <h2 style="margin:0 0 16px 0;font-family:'Space Grotesk',Arial,sans-serif;font-size:24px;color:#031B2A;">
      ${subject}
    </h2>
    ${recipientName ? `<p style="font-size:15px;line-height:1.7;color:#163247;margin:0 0 14px 0;">Hi ${recipientName},</p>` : ''}
    <div style="font-size:15px;line-height:1.7;color:#163247;white-space:pre-wrap;">
      ${content}
    </div>
  `,
};

module.exports = {
  wrapBranded,
  CONTENT,
  SOCIALS,
  LOGO_URL,
};