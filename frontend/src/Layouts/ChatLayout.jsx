import { Outlet } from "react-router-dom"

function ChatLayout() {
  return (
    <main className="w-full h-full bg-transparent">
      <Outlet />
    </main>
  )
}

export default ChatLayout
