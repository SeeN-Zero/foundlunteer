import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'
import handlebars from 'handlebars'
import nodemailer from 'nodemailer'

async function sendEmail (targetEmail: string, replacement: Record<string, unknown>, html: string, subject: string): Promise<void> {
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPassword = process.env.SMTP_PASSWORD

  if (smtpHost === undefined || smtpPort === undefined || smtpUser === undefined || smtpPassword === undefined) {
    throw new Error('SMTP configuration is incomplete')
  }

  // Mail HTML
  const filePath = path.join(dirname(fileURLToPath(import.meta.url)), '../../assets/' + html)
  const source = await fs.readFile(filePath, 'utf-8')
  const template = handlebars.compile(source)
  const htmlToSend = template(replacement)

  // Create Transporter
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort),
    secure: true,
    auth: {
      user: smtpUser,
      pass: smtpPassword
    }
  })

  // Create Message
  const message = {
    from: smtpUser,
    to: targetEmail,
    subject,
    html: htmlToSend
  }

  await transporter.sendMail(message)
}

export { sendEmail }
