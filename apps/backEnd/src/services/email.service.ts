import nodemailer from 'nodemailer'
import 'dotenv/config'
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export async function sendConfirmationEmail(email: string, token: string) {
  const confirmationLink = `${process.env.FRONT_APP_URL}/confirm-email/${token}`

  await transporter.sendMail({
    from: '"Deckorama" <noreply@deckorama.com>',
    to: email,
    subject: "Deckorama - Confirmation de votre compte",
    html: `
      <h1>Bienvenue sur Deckorama !</h1>
      <p>Pour activer votre compte, veuillez cliquer sur le lien suivant :</p>
      <a href="${confirmationLink}">Confirmer mon compte</a>
      <p>Ce lien expire dans 24 heures.</p>
    `
  })
}
