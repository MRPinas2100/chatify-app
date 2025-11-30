import { Route, Routes } from "react-router-dom"
import ChatPage from "./pages/ChatPage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import AuthLayout from "./Layouts/AuthLayout"
import ChatLayout from "./Layouts/ChatLayout"
import DecorationBackground from "./components/DecorationBackground"

function App() {
  return (
    <>
      <div className="h-full w-full bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
        {/* DECORATORS - GRID BG & GLOW SHAPES */}
        <DecorationBackground />

        <Routes>
          <Route element={<ChatLayout />}>
            <Route path="/" element={<ChatPage />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App
