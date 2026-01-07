/* eslint-disable no-unused-vars */

import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import { io } from "socket.io-client"
import { BASE_URL_SOCKET } from "../constants/BASE_URLS"

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check")
      if (res.status !== 200) throw new Error("Internal error.")
      const { data } = res
      set({ authUser: data })
    } catch (_) {
      set({ authUser: null })
      throw new Error("Error getting the check")
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      set({ isCheckingAuth: false })
    }
  },

  signup: async (formData) => {
    try {
      set({ isSigningUp: true })
      const res = await axiosInstance.post("/auth/signup", formData)
      if (res.status !== 201) throw new Error("Internal error.")
      const { data } = res
      set({ authUser: data })
      toast.success("Account created successfully!")
    } catch (err) {
      toast.error(err.response?.statusText ?? "Internal Error")
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      set({ isSigningUp: false })
    }
  },

  login: async (formdata) => {
    try {
      set({ isLoggingIn: true })
      const res = await axiosInstance.post("/auth/login", formdata)
      if (res.status !== 200) throw new Error("Internal error.")
      const { data } = res
      set({ authUser: data })

      const { connectSocket } = get()
      connectSocket()
    } catch (err) {
      toast.error(err.response?.statusText ?? "Internal Error")
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      set({ isLoggingIn: false })
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout")
      if (res.status !== 200) throw new Error("Internal error.")
      const { data } = res
      const { message } = data
      set({ authUser: null })

      const { disconnectSocket } = get()
      disconnectSocket()

      toast.success(message)
    } catch (err) {
      console.log(err)
      toast.error(err.response?.statusText ?? "Internal Error")
    }
  },

  updateProfile: async (profilePic) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", profilePic)
      if (res.status !== 200) throw new Error("Internal error.")
      const { data } = res
      set({ authUser: data })
      toast.success("Profile updated successfully")
    } catch (err) {
      toast.error(err.response?.statusText ?? "Internal Error")
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get()
    if (!authUser || socket?.connected) return

    const socketIo = io(BASE_URL_SOCKET, { withCredentials: true })
    socketIo.connect()
    set({ socket: socketIo })

    socketIo.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds })
    })
  },

  disconnectSocket: () => {
    const { socket } = get()
    if (socket.connected) socket.disconnect()
  },
}))
