import { NextResponse } from 'next/server';
import {
  sendEmail,
  clean,
  isValidEmail,
  submittedOn,
  NOTIFY_EMAIL,
  SITE_NAME,
} from '@/lib/mailer';

// Showcase-specific inquiry. Unlike the catalogue's "Pricing Inquiry" (price on
// request), showcase pieces already list a price, so this captures the piece,
// the selected price option, and an optional metal preference. Same inbox as
// /api/inquiry, but a distinguishable subject line.
export async function POST(req: Request) {
  const form = await req.formData();

  // Honeypot — bots that fill it get a silent fake success.
  if (form.get('website')) {
    return NextResponse.json({ success: true, message: 'Inquiry sent successfully!' });
  }

  const firstName = clean(form.get('fname'));
  const lastName = clean(form.get('lname'));
  const fullName = `${firstName} ${lastName}`.trim();
  const email = clean(form.get('email'));
  const phone = clean(form.get('phone'));
  const message = clean(form.get('message'));
  const metal = clean(form.get('metal'));
  const piece = clean(form.get('piece'));
  const style = clean(form.get('style'));
  const priceOption = clean(form.get('priceOption'));

  if (!firstName || !lastName || !email) {
    return NextResponse.json({ success: false, message: 'Please fill in all required fields.' });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ success: false, message: 'Please enter a valid email address.' });
  }

  // e.g. "Showcase inquiry — 14K Gold Lineman Pendant (610-103-S)"
  const subject = `Showcase inquiry — ${piece || 'Showcase piece'}${style ? ` (${style})` : ''}`;

  let body = `
<html>
<head>
    <style>
        body { font-family: Verdana, sans-serif; color: #333; font-size: 14px; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a2e0a; color: #ffcc00; padding: 20px; text-align: center; }
        .header h2 { margin: 0; font-size: 18px; }
        .body { background: #fff; padding: 25px; border: 1px solid #ccc; }
        .piece-badge { background: #f5f5e8; padding: 15px; border-radius: 4px; margin-bottom: 15px; }
        .piece-badge h3 { margin: 0 0 4px; color: #1a2e0a; }
        .piece-badge p { margin: 2px 0; font-size: 13px; color: #555; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 8px 0; border-bottom: 1px solid #eee; font-size: 13px; }
        td:first-child { font-weight: bold; width: 140px; color: #666; }
        .message { background: #fffff0; padding: 12px; border: 1px solid #ddd; margin: 10px 0; white-space: pre-wrap; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Showcase Inquiry - ${SITE_NAME}</h2>
        </div>
        <div class='body'>
            <div class='piece-badge'>
                <h3>${piece || 'Showcase piece'}</h3>`;

  if (style) body += `
                <p>Style #${style}</p>`;
  if (priceOption) body += `
                <p>Price option selected: ${priceOption}</p>`;

  body += `
            </div>

            <h4>Customer Information</h4>
            <table>
                <tr><td>Name</td><td>${fullName}</td></tr>
                <tr><td>Email</td><td>${email}</td></tr>`;
  if (phone) body += `
                <tr><td>Phone</td><td>${phone}</td></tr>`;
  if (metal) body += `
                <tr><td>Metal preference</td><td>${metal}</td></tr>`;
  body += `
            </table>`;

  if (message) {
    body += `
            <h4 style='margin-top:15px;'>Message</h4>
            <div class='message'>${message}</div>`;
  }

  body += `
            <p style='margin-top:20px; color:#999; font-size:11px;'>
                Submitted on ${submittedOn()}
            </p>
        </div>
    </div>
</body>
</html>`;

  const result = await sendEmail(NOTIFY_EMAIL, subject, body, email);
  if (result.success) {
    return NextResponse.json({ success: true, message: 'Inquiry sent successfully!' });
  }
  return NextResponse.json({
    success: false,
    message: 'Failed to send. Please call us at (336) 790-8214.',
  });
}
