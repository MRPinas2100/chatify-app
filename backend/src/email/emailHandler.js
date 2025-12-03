import { resendClient, sender } from "../lib/resend.js"
import { createWelcomeEmailTemplate } from "./emailTemplate.js"

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const html = createWelcomeEmailTemplate(name, clientURL)

  try {
    const { data, error: emailError } = await resendClient.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to: email,
      subject: "Welcome to Chatify!",
      html,
    })

    if (!emailError) {
      return { data }
    }

    console.error("Error sending email: ", error)
  } catch (error) {
    throw new Error("Internal server error.")
  }
}
