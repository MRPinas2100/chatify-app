import jwt from "jsonwebtoken"
import { ENV } from "./env.js"

export const generateToken = (userId) => {
  const { JWT_SECRET } = ENV

  if (!JWT_SECRET) throw new Error("SECRET not found")

  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  })
  return token
}

export const send_JTW_To_Cookies = (token, res) => {
  const { NODE_ENV } = ENV
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //Milliseconds
    httpOnly: true, //prevent XXS attacks: cross-site scripting
    sameSite: "strict", //CSRF Attacks
    secure: NODE_ENV === "development" ? false : true,
  })
}
