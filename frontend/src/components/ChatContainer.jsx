import { useEffect } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { useChatStore } from "../store/useChatStore"
import { ChatHeader } from "./ChatHeader"
import { NoChatHistoryPlaceholder } from "./NoChatHistoryPlaceholder"
import { MessageInput } from "./MessageInput"
import { MessagesLodingSkeleton } from "./MessagesLodingSkeleton"

export const ChatContainer = () => {
  const { selectedUser, getMessagesByUserId, messages, isMessagesLoading } =
    useChatStore()
  const { authUser } = useAuthStore()

  const { _id: userId, fullName } = selectedUser
  const { _id: userLoggedId } = authUser

  useEffect(() => {
    getMessagesByUserId(userId)
  }, [getMessagesByUserId, userId])

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => {
              const { _id: msgId, senderId, image, text, createdAt } = msg
              const alingMessage =
                senderId === userLoggedId ? "chat-end" : "chat-start"
              const bgBubbleMsg =
                senderId === userLoggedId
                  ? "bg-cyan-600 text-white"
                  : "bg-slate-800 text-slate-200"
              const createdAtMsg = new Date(createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })

              return (
                <div key={msgId} className={`chat ${alingMessage}`}>
                  <div className={`chat-bubble relative ${bgBubbleMsg}`}>
                    {image && (
                      <img
                        src={image}
                        className="rounded-lg h-48 object-cover"
                        alt="Shared"
                      />
                    )}
                    {text && <p className="mt-2">{text}</p>}
                    <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                      {createdAtMsg}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : isMessagesLoading ? (
          <MessagesLodingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={fullName} />
        )}
      </div>
      <MessageInput />
    </>
  )
}
