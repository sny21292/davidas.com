import type { EmailAttachment } from './mailer';

const MAX_FILES = 3;
const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB per file
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
]);

export async function extractAttachments(form: FormData): Promise<EmailAttachment[]> {
  const files = form.getAll('attachments');
  const attachments: EmailAttachment[] = [];

  for (const entry of files) {
    if (!(entry instanceof File) || !entry.size || !entry.name) continue;
    if (attachments.length >= MAX_FILES) break;
    if (entry.size > MAX_SIZE_BYTES) continue;
    if (!ALLOWED_TYPES.has(entry.type)) continue;

    const buffer = Buffer.from(await entry.arrayBuffer());
    attachments.push({ filename: entry.name, content: buffer });
  }

  return attachments;
}

export function attachmentEmailHtml(count: number): string {
  if (count === 0) return '';
  return `
            <h4 style='margin-top:15px;'>Attachments</h4>
            <p style='font-size:13px; color:#555;'>${count} file${count > 1 ? 's' : ''} attached to this email.</p>`;
}
