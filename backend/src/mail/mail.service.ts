import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as imaps from 'imap-simple';
import * as nodemailer from 'nodemailer';
import { simpleParser } from 'mailparser';

@Injectable()
export class MailService {
    constructor(private configService: ConfigService) { }

    private getImapConfig(user: any) {
        return {
            imap: {
                user: user.email,
                password: user.password,
                host: this.configService.get('IMAP_HOST'),
                port: this.configService.get('IMAP_PORT'),
                tls: true,
                authTimeout: 10000,
            },
        };
    }

    private mapFolder(folder: string): string {
        const folderMap = {
            'inbox': 'INBOX',
            'sent': 'Sent',
            'trash': 'Trash',
            'drafts': 'Drafts',
            'spam': 'Junk'
        };
        return folderMap[folder.toLowerCase()] || folder;
    }

    private cleanRawPreview(rawText: string): string {
        if (!rawText) return '';

        // Remove MIME boundaries and headers more aggressively
        let cleaned = rawText
            // Remove MIME boundaries (various formats)
            .replace(/--[0-9a-fA-F]{20,}/g, '')
            .replace(/--[A-Za-z0-9_\-]+/g, '')
            // Remove Content-Type headers (multiline)
            .replace(/Content-Type:\s*[^;]+[^;]*;?\s*charset\s*=\s*["']?[^"'\s]+["']?/gi, '')
            .replace(/Content-Type:\s*[^\r\n]+/gi, '')
            // Remove Content-Transfer-Encoding
            .replace(/Content-Transfer-Encoding:\s*[^\r\n]+/gi, '')
            // Remove Content-Disposition
            .replace(/Content-Disposition:\s*[^\r\n]+/gi, '')
            // Remove quoted-printable markers
            .replace(/=\r?\n/g, '')
            .replace(/=[0-9A-F]{2}/gi, '')
            // Remove boundary lines
            .replace(/^\s*--.*$/gm, '')
            // Remove empty lines and normalize
            .replace(/^\s*$/gm, '')
            .replace(/\r\n|\n|\r/g, ' ')
            // Remove multiple spaces
            .replace(/\s+/g, ' ')
            .trim();

        // Find the actual content (usually after headers)
        // Look for text that doesn't look like headers
        const lines = cleaned.split(' ');
        let contentStart = 0;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].toLowerCase();
            // Skip if it looks like a header or MIME artifact
            if (line.includes('content-') || 
                line.includes('charset') || 
                line.includes('encoding') ||
                line.includes('disposition') ||
                line.match(/^[a-z-]+:/)) {
                contentStart = i + 1;
            } else if (line.length > 3 && !line.match(/^[0-9a-f-]+$/)) {
                // Found actual content
                break;
            }
        }

        cleaned = lines.slice(contentStart).join(' ').trim();

        // Take first 150 characters of actual content
        return cleaned.substring(0, 150) || '(Sin contenido)';
    }

    async getMessages(user: any, folder: string = 'inbox') {
        const boxName = this.mapFolder(folder);
        const connection = await imaps.connect(this.getImapConfig(user));

        try {
            await connection.openBox(boxName);

            const searchCriteria = (folder === 'starred') ? [['FLAGGED']] : ['ALL'];
            const fetchOptions = {
                bodies: ['HEADER', ''], // Fetch both header and full body
                markSeen: false,
                struct: true
            };

            // Fetch dynamic range? For now get all but limit might be needed
            const messages = await connection.search(searchCriteria, fetchOptions);

            return await Promise.all(messages.map(async (msg) => {
                const headerPart = msg.parts.find((p) => p.which === 'HEADER');
                const fullBodyPart = msg.parts.find(p => p.which === '');

                let preview = '';
                let hasAttachments = false;

                // Try to parse the full body for better preview, but don't break if it fails
                if (fullBodyPart && fullBodyPart.body) {
                    try {
                        const parsed = await simpleParser(fullBodyPart.body);
                        // Use text content, fallback to HTML stripped of tags
                        if (parsed.text && parsed.text.trim()) {
                            preview = parsed.text
                                .replace(/\r\n|\n|\r/g, ' ') // Normalize line breaks
                                .replace(/\s+/g, ' ') // Normalize whitespace
                                .trim()
                                .substring(0, 150);
                        } else if (parsed.html && parsed.html.trim()) {
                            // Strip HTML tags for preview
                            preview = parsed.html
                                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
                                .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove styles
                                .replace(/<[^>]*>/g, '') // Remove HTML tags
                                .replace(/&nbsp;/g, ' ')
                                .replace(/&amp;/g, '&')
                                .replace(/&lt;/g, '<')
                                .replace(/&gt;/g, '>')
                                .replace(/&quot;/g, '"')
                                .replace(/&#39;/g, "'")
                                .replace(/&[a-z]+;/gi, ' ') // Remove other HTML entities
                                .replace(/\r\n|\n|\r/g, ' ')
                                .replace(/\s+/g, ' ')
                                .trim()
                                .substring(0, 150);
                        }
                        hasAttachments = parsed.attachments && parsed.attachments.length > 0;
                    } catch (error) {
                        // Silently fall back to raw text cleaning
                        const textPart = msg.parts.find(p => p.which === 'TEXT');
                        if (textPart && textPart.body) {
                            preview = this.cleanRawPreview(textPart.body);
                        } else {
                            preview = this.cleanRawPreview(fullBodyPart.body);
                        }
                    }
                } else {
                    // Fallback: use TEXT part if available
                    const textPart = msg.parts.find(p => p.which === 'TEXT');
                    if (textPart && textPart.body) {
                        preview = this.cleanRawPreview(textPart.body);
                    }
                }

                // Ensure we have a preview
                if (!preview || preview.trim() === '') {
                    preview = '(Sin contenido)';
                }

                // Extract subject safely - always use header first
                let subject = '(No Subject)';
                if (headerPart?.body?.subject) {
                    const subjectValue = headerPart.body.subject[0];
                    if (subjectValue) {
                        subject = typeof subjectValue === 'string' ? subjectValue : String(subjectValue);
                    }
                }
                
                // Extract from safely - handle both string and object formats
                let from = '(Unknown)';
                if (headerPart?.body?.from) {
                    const fromValue = headerPart.body.from[0];
                    if (fromValue) {
                        if (typeof fromValue === 'string') {
                            from = fromValue;
                        } else if (fromValue?.text) {
                            from = fromValue.text;
                        } else if (fromValue?.value && Array.isArray(fromValue.value) && fromValue.value[0]?.address) {
                            from = fromValue.value[0].address;
                        } else if (fromValue?.address) {
                            from = fromValue.address;
                        }
                    }
                }
                
                // Extract date safely
                let date = new Date().toISOString();
                if (headerPart?.body?.date?.[0]) {
                    const dateValue = headerPart.body.date[0];
                    if (dateValue) {
                        if (dateValue instanceof Date) {
                            date = dateValue.toISOString();
                        } else if (typeof dateValue === 'string') {
                            const parsed = new Date(dateValue);
                            if (!isNaN(parsed.getTime())) {
                                date = parsed.toISOString();
                            }
                        }
                    }
                }

                return {
                    id: msg.attributes.uid,
                    seq: msg.seqno || msg.seqNo || 0,
                    subject: subject,
                    from: from,
                    date: date,
                    preview: preview,
                    read: msg.attributes.flags && msg.attributes.flags.includes('\\Seen'),
                    starred: msg.attributes.flags && msg.attributes.flags.includes('\\Flagged'),
                    folder: folder,
                    hasAttachments: hasAttachments
                };
            }));
        } finally {
            connection.end();
        }
    }

    async getMessageBody(user: any, uid: string, folder: string = 'inbox') {
        const boxName = this.mapFolder(folder);
        const connection = await imaps.connect(this.getImapConfig(user));
        try {
            await connection.openBox(boxName);
            const searchCriteria = [['UID', uid]];
            const fetchOptions = {
                bodies: [''],
                markSeen: true,
            };
            const messages = await connection.search(searchCriteria, fetchOptions);
            if (messages.length === 0) return null;

            const msg = messages[0];
            const rawBody = msg.parts.find(p => p.which === '')?.body;
            if (!rawBody) return { body: '(No Content)' };

            const parsed = await simpleParser(rawBody);

            // Clean HTML content - remove scripts and sanitize
            let cleanHtml = parsed.html || parsed.textAsHtml;
            if (cleanHtml) {
                // Remove script tags and their content
                cleanHtml = cleanHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                // Remove style tags that might contain malicious content
                cleanHtml = cleanHtml.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
            }

            // Clean text content
            let cleanText = parsed.text;
            if (cleanText) {
                cleanText = cleanText
                    .replace(/\r\n|\n|\r/g, '\n') // Normalize line breaks
                    .replace(/\n{3,}/g, '\n\n'); // Max 2 consecutive newlines
            }

            return {
                subject: parsed.subject || '(No Subject)',
                from: parsed.from?.text || parsed.from?.value?.[0]?.address || '(Unknown)',
                to: Array.isArray(parsed.to)
                    ? parsed.to.map(a => a.text || a.value?.[0]?.address).join(', ')
                    : (parsed.to?.text || parsed.to?.value?.[0]?.address || ''),
                date: parsed.date || new Date(),
                html: cleanHtml,
                text: cleanText,
                attachments: (parsed.attachments || []).map(att => ({
                    filename: att.filename || 'attachment',
                    contentType: att.contentType || 'application/octet-stream',
                    size: att.size || 0,
                    checksum: att.checksum || ''
                }))
            };
        } finally {
            connection.end();
        }
    }

    async markMessage(user: any, uid: string, action: 'read' | 'unread' | 'star' | 'unstar' | 'archive' | 'trash') {
        const connection = await imaps.connect(this.getImapConfig(user));
        try {
            await connection.openBox('INBOX'); // Assuming action is in INBOX for now, otherwise need folder param

            const uidNum = parseInt(uid, 10);

            // addFlags/delFlags expect number (UID) per previous error
            if (action === 'read') await connection.addFlags(uidNum, '\\Seen');
            if (action === 'unread') await connection.delFlags(uidNum, '\\Seen');
            if (action === 'star') await connection.addFlags(uidNum, '\\Flagged');
            if (action === 'unstar') await connection.delFlags(uidNum, '\\Flagged');

            // moveMessage apparently expects string (Sequence Set) per latest error?
            // "Argument of type 'number' is not assignable to parameter of type 'string | string[]'."
            if (action === 'trash') await connection.moveMessage(uid, 'Trash');
            if (action === 'archive') await connection.moveMessage(uid, 'Archive'); // Ensure Archive folder exists
        } finally {
            connection.end();
        }
    }

    async sendMail(user: any, to: string, subject: string, text: string, attachments: Express.Multer.File[] = []) {
        const transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST'),
            port: this.configService.get('SMTP_PORT'),
            secure: false,
            auth: {
                user: user.email,
                pass: user.password,
            },
        });

        const mailOptions: any = {
            from: user.email,
            to,
            subject,
            text,
        };

        if (attachments && attachments.length > 0) {
            mailOptions.attachments = attachments.map(file => ({
                filename: file.originalname,
                content: file.buffer
            }));
        }

        const info = await transporter.sendMail(mailOptions);
        return { message: 'Email sent', messageId: info.messageId };
    }
}
