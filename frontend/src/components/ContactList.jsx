import { useEffect } from "react"
import { useChatStore } from "../store/useChatStore"
import { UsersLoadingSkeleton } from "./UsersLoadingSkeleton"
import { NoChatsFound } from "./NoChatsFound"

export const ContactList = () => {
  const { getAllContacts, allContacts, setActiveUser, isUsersLoading } =
    useChatStore()

  const handleClickSelectedUser = (chat) => {
    setActiveUser(chat)
  }

  useEffect(() => {
    getAllContacts()
  }, [getAllContacts])

  if (isUsersLoading) return <UsersLoadingSkeleton />
  if (allContacts.length === 0) return <NoChatsFound />

  return (
    <>
      {allContacts.map((chat) => {
        const { _id, profilePic, fullName } = chat

        return (
          <div
            key={_id}
            className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
            onClick={() => handleClickSelectedUser(chat)}
          >
            <div className="flex items-center gap-3">
              <div className={`avatar online`}>
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
