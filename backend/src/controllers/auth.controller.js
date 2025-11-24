import { ENV } from "../lib/env.js"
import { sendWelcomeEmail } from "../email/emailHandler.js"
import { generateToken, send_JTW_To_Cookies } from "../lib/utils.js"
import { User } from "../models/User.js"
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body
  const { CLIENT_URL } = ENV

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" })
    }

    //Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isEmailValid = emailRegex.test(email)
    if (!isEmailValid) {
      return res.status(400).json({ message: "Invalid email format" })
    }

    const user = await User.findOne({ email })
    if (user) return res.status(400).json({ message: "Email already exists" })

    //make secure passwords
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    })

    if (newUser) {
      const savedUser = await newUser.save()
      const token = generateToken(savedUser._id)
      send_JTW_To_Cookies(token, res)

      res.status(201).json({
        _id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        profilePic: savedUser.profilePic,
      })

      try {
        const { data } = await sendWelcomeEmail(
          savedUser.email,
          savedUser.fullName,
          CLIENT_URL
        )
      } catch (error) {
        console.error(error)
      }
    } else {
      res.status(400).json({ message: "Invalid user" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal error" })
  }
}
