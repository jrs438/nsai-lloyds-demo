import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    _resend = new Resend(key);
  }
  return _resend;
}

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  const from = process.env.EMAIL_FROM;
  const replyTo = process.env.EMAIL_REPLY_TO;

  if (!from) {
    throw new Error("EMAIL_FROM is not configured");
  }

  return getResend().emails.send({
    from,
    replyTo: replyTo ? [replyTo] : undefined,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text: text ?? stripHtml(html),
  });
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function magicLinkEmailTemplate(params: {
  url: string;
  recipientName: string;
}): { subject: string; html: string } {
  return {
    subject: "Your access to NSAI Lloyd's market demonstrations",
    html: `
<!doctype html>
<html>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #eaeaea; padding: 40px 20px; margin: 0;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 560px; margin: 0 auto;">
      <tr>
        <td>
          <div style="border-bottom: 1px solid #2a2a2a; padding-bottom: 16px; margin-bottom: 32px;">
            <div style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #a0a0a0;">NSAI for Insurance</div>
            <div style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #6a6a6a; margin-top: 4px;">Lloyd's Market Demonstrations</div>
          </div>
          <h1 style="font-family: Georgia, serif; font-weight: 300; font-size: 28px; line-height: 1.2; color: #ffffff; margin: 0 0 16px 0;">Your access is approved</h1>
          <p style="color: #a0a0a0; line-height: 1.6; margin: 0 0 12px 0;">${escapeHtml(params.recipientName)},</p>
          <p style="color: #a0a0a0; line-height: 1.6; margin: 0 0 24px 0;">
            You can now explore the gated demonstration platform. Use the link below to sign in.
            The link is valid for 7 days from the time of this email.
          </p>
          <a href="${params.url}" style="display: inline-block; padding: 14px 28px; background: #c9a961; color: #0a0a0a; text-decoration: none; font-weight: 500; font-size: 14px; letter-spacing: 0.02em;">
            Open demonstrations →
          </a>
          <p style="color: #6a6a6a; font-size: 12px; margin: 32px 0 0 0; word-break: break-all;">
            Or paste this link into your browser:<br />
            <span style="color: #a0a0a0;">${params.url}</span>
          </p>
          <div style="border-top: 1px solid #2a2a2a; margin-top: 40px; padding-top: 16px; color: #6a6a6a; font-size: 12px;">
            If you did not request this access, you can ignore this email.
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  };
}

export function adminNotificationTemplate(params: {
  request: {
    id: string;
    email: string;
    name: string;
    company: string;
    role: string;
    notes: string | null;
  };
  adminUrl: string;
}): { subject: string; html: string } {
  return {
    subject: `Access request — ${params.request.name}, ${params.request.company}`,
    html: `
<!doctype html>
<html>
  <body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #0a0a0a; color: #eaeaea; padding: 32px;">
    <table cellpadding="0" cellspacing="0" border="0" style="max-width: 600px;">
      <tr><td>
        <div style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #a0a0a0;">Access Request</div>
        <h2 style="font-family: Georgia, serif; font-weight: 400; color: #ffffff; margin: 8px 0 24px 0;">${escapeHtml(params.request.name)}</h2>
        <table cellpadding="6" cellspacing="0" border="0" style="border-collapse: collapse; font-size: 14px;">
          <tr><td style="color: #6a6a6a; padding-right: 24px;">Email</td><td style="color: #eaeaea;">${escapeHtml(params.request.email)}</td></tr>
          <tr><td style="color: #6a6a6a; padding-right: 24px;">Company</td><td style="color: #eaeaea;">${escapeHtml(params.request.company)}</td></tr>
          <tr><td style="color: #6a6a6a; padding-right: 24px;">Role</td><td style="color: #eaeaea;">${escapeHtml(params.request.role)}</td></tr>
          ${params.request.notes ? `<tr><td style="color: #6a6a6a; padding-right: 24px; vertical-align: top;">Notes</td><td style="color: #eaeaea;">${escapeHtml(params.request.notes)}</td></tr>` : ""}
        </table>
        <div style="margin-top: 32px;">
          <a href="${params.adminUrl}" style="display: inline-block; padding: 12px 24px; background: #c9a961; color: #0a0a0a; text-decoration: none; font-weight: 500; font-size: 14px;">Review in admin panel →</a>
        </div>
      </td></tr>
    </table>
  </body>
</html>`,
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
