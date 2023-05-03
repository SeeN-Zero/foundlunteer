import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import handlebars from 'handlebars'
import nodemailer from 'nodemailer'
import { setTimeout } from 'timers/promises'

class email {
  async sendEmail (targetEmail: string, replacement: any, html: string, subject: string): Promise<void> {
    await setTimeout(1000)
    // Mail HTML
    const filePath = path.join(dirname(fileURLToPath(import.meta.url)), '../../assets/' + html)
    const source = fs.readFileSync(filePath, 'utf-8').toString()
    const template = handlebars.compile(source)
    const htmlToSend = template(replacement)

    // Create Transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST as string,
      port: parseInt(process.env.SMTP_PORT as string),
      secure: true,
      auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASSWORD as string
      }
    })

    // Create Message
    const message = {
      from: process.env.SMTP_USER as string,
      to: targetEmail,
      subject,
      html: htmlToSend
    }

    await transporter.sendMail(message)
  }
}

export default email
