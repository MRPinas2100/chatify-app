import { useAuthStore } from "../store/useAuthStore"

function ChatPage() {
  const { logout } = useAuthStore()

  const click = () => {
    console.log("click...")
    logout()
  }
  return (
    <div className="flex items-center justify-center z-10">
      <button className="z-50" onClick={click}>
        Logout
      </button>
    </div>
  )
}

export default ChatPage
