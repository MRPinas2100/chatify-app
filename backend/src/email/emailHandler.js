import { resendClient, sender } from "../lib/resend.js"
import { createWelcomeEmailTemplate } from "./emailTemplate.js"

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const html = createWelcomeEmailTemplate(name, clientURL)

  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome to Chatify!",
    html,
  })

  if (error) {
    console.error("Error sending email: ", error)
    throw new Error("Failed sending the email.")
  }

  return { data }
}
