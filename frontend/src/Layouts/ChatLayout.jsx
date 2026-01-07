import { Outlet } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore"
import { useEffect } from "react"

export const ChatLayout = () => {
  const { connectSocket } = useAuthStore()

  useEffect(() => {
    connectSocket()
  }, [connectSocket])

  return (
    <main className="flex items-center justify-center w-full h-full bg-transparent">
      <Outlet />
    </main>
  )
}
