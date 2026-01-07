import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import { useAuthStore } from "./useAuthStore"

const notificationSound = new Audio("/sounds/notification.mp3")

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
      toast.error(err.response?.statusText ?? "Internal Error")
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      set({ isUsersLoading: false })
    }
  },

  getMyChatPartners: async () => {
    try {
      set({ isUsersLoading: true })
      const res = await axiosInstance.get("/messages/chats")
      if (res.status !== 200) throw new Error("Internal error.")
      const { data } = res
      set({ chats: data })
    } catch (err) {
      toast.error(err.response?.statusText ?? "Internal Error")
    } finally {
      set({ isUsersLoading: false })
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true })

    try {
      const res = await axiosInstance.get(`/messages/${userId}`)
      if (res.status !== 200) throw new Error("Internal error.")
      const { data } = res
      set({ messages: data })
    } catch (err) {
      toast.error(err.response?.statusText ?? "Internal Error")
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      set({ isMessagesLoading: false })
    }
  },

  sendMessage: async (payload) => {
    const { selectedUser, messages } = get()
    const { _id } = selectedUser
    const { authUser } = useAuthStore.getState()
    const tempId = `temp-${Date.now()}`

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: _id,
      text: payload.text,
      image: payload.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    }

    //Update the ui in the moment user send messages
    set({ messages: [...messages, optimisticMessage] })

    try {
      const res = await axiosInstance.post(`/messages/send/${_id}`, payload)
      if (res.status !== 201) throw new Error("Internal Error")
      const { data } = res
      set({ messages: [...messages, data] })
    } catch (err) {
      set({ messages: messages })
      if (err.status === 400)
        return toast.error("Image size is too large, Limit: 5mb")

      toast.error(err.response?.statusText ?? "Internal Error")
    }
  },

  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get()
    if (!selectedUser) return
    const socket = useAuthStore.getState().socket

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id

      if (!isMessageSentFromSelectedUser) return

      const { messages } = get()
      set({ messages: [...messages, newMessage] })

      if (isSoundEnabled) {
        notificationSound.currentTime = 0
        notificationSound
          .play()
          .catch((e) => console.log("Audio play failed", e))
      }
    })
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket
    socket.off("newMessage")
  },
}))
