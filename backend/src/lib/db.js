import mongoose from "mongoose"

export const connectDB = async () => {
  const { MONGO_URI } = process.env
  try {
    if (!MONGO_URI) throw new Error("MONGO_URI is not set")
    await mongoose.connect(MONGO_URI)
  } catch (_) {
    process.exit(1)
  }
}
