import mongoose from "mongoose"
import { ENV } from "./env.js"

export const connectDB = async () => {
  const { MONGO_URI } = ENV
  try {
    if (!MONGO_URI) throw new Error("MONGO_URI is not set")
    await mongoose.connect(MONGO_URI)
  } catch (_) {
    process.exit(1)
  }
}
