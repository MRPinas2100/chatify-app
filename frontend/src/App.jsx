import { Route, Routes } from "react-router"
import ChatPage from "./pages/ChatPage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"

function App() {
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<ChatPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/signup" element={<SignUpPage />}></Route>
        </Routes>
      </div>
    </>
  )
}

export default App
