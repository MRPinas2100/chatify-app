import express from "express"
import path from "path"
import cookieParser from "cookie-parser"
import cors from "cors"

import authRoutes from "./routes/auth.route.js"
import messagesRoutes from "./routes/messages.route.js"
import { connectDB } from "./lib/db.js"
import { ENV } from "./lib/env.js"

const app = express()
const __dirname = path.resolve()
const { PORT, NODE_ENV, CLIENT_URL } = ENV

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
)
app.options(
  "*",
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
)
app.use(express.json({ limit: "20mb" }))
app.use(express.urlencoded({ extended: true, limit: "20mb" }))
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/messages", messagesRoutes)

//make ready for deployment
if (NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")))
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
  })
}

connectDB()
  .then(() => {
    app.listen(PORT || 3000)
  })
  .catch((_) => {
    console.error("Failed to connect to MongoDB")
    process.exit(1)
  })
