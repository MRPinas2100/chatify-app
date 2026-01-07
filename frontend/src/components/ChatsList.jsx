import { useEffect } from "react"
import { useChatStore } from "../store/useChatStore"
import { UsersLoadingSkeleton } from "../components/UsersLoadingSkeleton"
import { NoChatsFound } from "../components/NoChatsFound"
import { useAuthStore } from "../store/useAuthStore"

export const ChatsList = () => {
  const { getMyChatPartners, chats, isUsersLoading, setActiveUser } =
    useChatStore()

  const { onlineUsers } = useAuthStore()

  const handleClickActiveUser = (chat) => {
    setActiveUser(chat)
  }

  const stylesOnlineUser = (id) => {
    return onlineUsers.includes(id) ? "online" : "offline"
  }

  useEffect(() => {
    getMyChatPartners()
  }, [getMyChatPartners])

  if (isUsersLoading) return <UsersLoadingSkeleton />
  if (chats.length === 0) return <NoChatsFound />

  return (
    <>
      {chats.map((chat) => {
        const { _id, profilePic, fullName } = chat

        return (
          <div
            key={_id}
            className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
            onClick={() => handleClickActiveUser(chat)}
          >
            <div className="flex items-center gap-3">
              <div className={`avatar ${stylesOnlineUser(_id)}`}>
                <div className="size-12 rounded-full">
                  <img src={profilePic || "/avatar.png"} alt={fullName} />
                </div>
              </div>
              <h4 className="text-slate-200 font-medium truncate">
                {fullName}
              </h4>
            </div>
          </div>
        )
      })}
    </>
  )
}
