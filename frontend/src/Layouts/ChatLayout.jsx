import { Outlet } from "react-router-dom"

function ChatLayout() {
  return (
    <main className="flex items-center justify-center w-full h-full bg-transparent">
      <Outlet />
    </main>
  )
}

export default ChatLayout
