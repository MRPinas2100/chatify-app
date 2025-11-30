import { Outlet } from "react-router-dom"

function ChatLayout() {
  return (
    <div className="app-layout">
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}

export default ChatLayout
