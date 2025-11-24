import "dotenv/config"

const {
  PORT,
  MONGO_URI,
  NODE_ENV,
  JWT_SECRET,
  RESEND_API_KEY,
  EMAIL_FROM,
  EMAIL_FROM_NAME,
  CLIENT_URL,
} = process.env

export const ENV = {
  PORT: PORT || 3000,
  MONGO_URI,
  NODE_ENV,
  JWT_SECRET,
  RESEND_API_KEY,
  EMAIL_FROM,
  EMAIL_FROM_NAME,
  CLIENT_URL,
}
