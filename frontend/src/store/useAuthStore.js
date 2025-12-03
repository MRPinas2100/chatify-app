/* eslint-disable no-unused-vars */

import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,

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
    set({ isSigningUp: true })

    try {
      const res = await axiosInstance.post("auth/signup", formData)
      if (res.status !== 201) throw new Error("Internal error.")
      const { data } = res
      set({ authUser: data })
      toast.success("Account created successfully!")
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Internal Error")
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      set({ isSigningUp: false })
    }
  },
}))
