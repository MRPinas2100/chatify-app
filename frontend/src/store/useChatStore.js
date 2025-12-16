import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")),

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled)
    set({ isSoundEnabled: !get().isSoundEnabled })
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setActiveUser: (newSelectedUser) => set({ selectedUser: newSelectedUser }),

  getAllContacts: async () => {
    try {
      set({ isUsersLoading: true })
      const res = await axiosInstance.get("/messages/contacts")
      if (res.status !== 200) throw new Error("Internal error.")
      const { data } = res
      set({ allContacts: data })
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Internal Error")
    } finally {
      set({ isUsersLoading: false })
    }
  },

  getMyChatPartners: async () => {
    try {
      set({ isUsersLoading: true })
      const res = await axiosInstance.get("/messages/chats")
      if (res.status !== 200) throw new Error("Internal error.")
      const { data } = res
      set({ allContacts: data })
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Internal Error")
    } finally {
      set({ isUsersLoading: false })
    }
  },
}))
