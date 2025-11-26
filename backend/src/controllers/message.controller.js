import { cloudinary } from "../lib/cloudinary.js"
import { Message } from "../models/Messages.js"
import { User } from "../models/User.js"

export const getAllContacts = async (req, res) => {
  const loggedInUserId = req.user._id
  try {
    const filteredUsers = await User.find({
      id: { $ne: loggedInUserId },
    }).select("-password")
    res.status(200).json({ filteredUsers })
  } catch (_) {
    res.status(500).json({ message: "Internal server error" })
  }
}

export const getUserChats = async (req, res) => {
  const loggedInUserId = req.user._id

  try {
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    })

    const chatUsersId = [
      ...new Set(
        messages.map((msg) => {
          return msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        })
      ),
    ]

    const chatUser = await User.find({ _id: { $in: chatUsersId } }).select(
      "-password"
    )
    res.status(200).json(chatUser)
  } catch (_) {
    res.status(500).json({ message: "Internal Server error" })
  }
}

export const getMessagesByUserId = async (req, res) => {
  const userId = req.user._id
  const { id: userToChatId } = req.params

  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: userId },
      ],
    })

    res.status(200).json(messages)
  } catch (_) {
    res.status(500).json({ message: "Internal server error" })
  }
}

export const sendMessage = async (req, res) => {
  const { text, image } = req.body
  const { id: receiverId } = req.params
  const senderId = req.user._id
  let imageUrl = null
  try {
    if (image) {
      //upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image)
      imageUrl = uploadResponse.secure_url
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    })
    await newMessage.save()
    res.status(201).json({ newMessage })
  } catch (_) {
    res.status(500).json({ message: "Internal server error" })
  }
}
