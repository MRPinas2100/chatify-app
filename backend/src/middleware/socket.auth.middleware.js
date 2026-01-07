import jwt from "jsonwebtoken"
import { User } from "../models/User.js"
import { ENV } from "../lib/env.js"

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1]

    if (!token) {
      console.log("Socket connetion rejected: No Token provided")
      return next(new Error("Unauthorized - No Token Provided"))
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET)
    if (!decoded) {
      console.log("Socket connection rejected: Invalid Token")
      return next(new Error("Unauthorized - Invalid Token"))
    }

    const user = await User.findById(decoded.userId).select("-password")
    if (!user) {
      console.log("Socket connection rejected: User not found")
      return next(new Error("User not found"))
    }

    socket.user = user
    socket.userId = user._id.toString()

    next()
  } catch (error) {
    console.log("Error in socket", error.message)
    next(new Error("Error in socket"))
  }
}
