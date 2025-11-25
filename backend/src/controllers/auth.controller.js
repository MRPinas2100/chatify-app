import { ENV } from "../lib/env.js"
import { sendWelcomeEmail } from "../email/emailHandler.js"
import { generateToken, send_JWT_To_Cookies } from "../lib/utils.js"
import { User } from "../models/User.js"
import { cloudinary } from "../lib/cloudinary.js"
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
      send_JWT_To_Cookies(token, res)

      res.status(201).json({
        _id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        profilePic: savedUser.profilePic,
      })

      try {
        await sendWelcomeEmail(savedUser.email, savedUser.fullName, CLIENT_URL)
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

export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" })
  }

  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: "Invalid credentials" })
    const passwordCorrect = bcrypt.compare(password, user.password)
    if (!passwordCorrect)
      return res.status(400).json({ message: "Invalid credentials" })
    const token = generateToken(user._id)
    send_JWT_To_Cookies(token, res)
    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const logout = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 })
  res.status(200).json({ message: "Logged successfuly" })
}

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body

    if (!profilePic)
      return res.status(400).json({ message: "Profile picture is required" })

    const userId = req.user._id
    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    )
    res.status(200).json({ message: updateUser })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const check = (req, res) => {
  res.status(200).json(req.user)
}
