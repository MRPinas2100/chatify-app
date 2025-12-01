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
      if (!res.ok) throw new Error("Error getting the user check")
      const { data } = res
      set({ authUser: data })
    } catch (err) {
      set({ authUser: null })
      console.error(err)
      throw new Error("Internal error")
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 5000))
      set({ isCheckingAuth: false })
    }
  },

  signup: async (formData) => {
    set({ isSigningUp: true })

    try {
      const res = await axiosInstance.post("auth/signup", formData)
      if (!res.ok) {
        throw new Error("Internal error.")
      }
      const { data } = res
      set({ authUser: data })
      toast.success("Account created successfully!")
    } catch (err) {
      toast.error(err.reponse.data.message)
      throw new Error("Internal error.")
    } finally {
      set({ isSigningUp: false })
    }
  },
}))
