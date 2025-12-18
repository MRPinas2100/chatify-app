import { useChatStore } from "../store/useChatStore"

export const ActiveTabSwitch = () => {
  const { activeTab, setActiveTab } = useChatStore()

  const handleClickActiveTab = (tab) => {
    setActiveTab(tab)
  }

  // Clases for btns
  let activeTab1Classes = `tab ${
    activeTab === "chats" ? "bg-cyan-500/20" : "text-slate-400"
  }`
  let activeTab2Classes = `tab ${
    activeTab === "contacts" ? "bg-cyan-500/20" : "text-slate-400"
  }`
  // Clases for btns

  return (
    <div className="tabs tabs-boxed bg-transparent p-2 m-2 gap-2">
      <button
        onClick={() => handleClickActiveTab("chats")}
        className={activeTab1Classes}
      >
        Chats
      </button>
      <button
        onClick={() => handleClickActiveTab("contacts")}
        className={activeTab2Classes}
      >
        Contacts
      </button>
    </div>
  )
}
