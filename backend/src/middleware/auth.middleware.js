import jwt from "jsonwebtoken"
import { User } from "../models/User.js"
import { ENV } from "../lib/env.js"

export const protectRoute = async (req, res, next) => {
  const { JWT_SECRET } = ENV

  if (!JWT_SECRET) throw new Error("json web token not set")

  try {
    const token = req.cookies.jwt
    if (!token) return res.status(401).json({ message: "Unauthorized" })

    const decoded = jwt.verify(token, JWT_SECRET)
    if (!decoded) return res.status(401).json({ message: "Unauthorized" })

    const user = await User.findById(decoded.userId).select("-password")
    if (!user) return res.status(404).json({ message: "User not found" })

    req.user = user

    next()
  } catch (_) {
    return res.status(500).json({ message: "Internal server error" })
  }
}
