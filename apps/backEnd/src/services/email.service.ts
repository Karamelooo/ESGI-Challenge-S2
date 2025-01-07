import nodemailer from 'nodemailer'
import 'dotenv/config'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendConfirmationEmail(email: string, token: string) {
  const confirmationLink = `${process.env.FRONT_APP_URL}/confirm-email/${token}`

  await transporter.sendMail({
    from: '"Deckorama" <noreply@deckorama.com>',
    to: email,
    subject: 'Deckorama - Confirmation de votre compte',
    html: `
      <h1>Bienvenue sur Deckorama !</h1>
      <p>Pour activer votre compte, veuillez cliquer sur le lien suivant :</p>
      <a href="${confirmationLink}">Confirmer mon compte</a>
      <p>Ce lien expire dans 24 heures.</p>
    `,
  })
}

export async function sendLockoutEmail(email: string, lockUntil: Date) {
  await transporter.sendMail({
    from: '"Deckorama" <noreply@deckorama.com>',
    to: email,
    subject: 'Deckorama - Compte temporairement bloqué',
    html: `
      <h1>Compte temporairement bloqué</h1>
      <p>Suite à plusieurs tentatives de connexion échouées, votre compte a été temporairement bloqué.</p>
      <p>Vous pourrez réessayer de vous connecter à partir de : ${lockUntil.toLocaleString()}</p>
    `,
  })
}

export async function sendResetPasswordEmail(email: string, token: string) {
  const resetLink = `${process.env.FRONT_APP_URL}/reset-password/${token}`

  await transporter.sendMail({
    from: '"Deckorama" <noreply@deckorama.com>',
    to: email,
    subject: 'Deckorama - Réinitialisation de votre mot de passe',
    html: `
      <h1>Réinitialisation de votre mot de passe</h1>
      <p>Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant :</p>
      <a href="${resetLink}">Réinitialiser mon mot de passe</a>
      <p>Ce lien expire dans 1 heure.</p>
    `,
  })
}
