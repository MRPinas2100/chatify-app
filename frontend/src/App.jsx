import ChatPage from "./pages/ChatPage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import AuthLayout from "./Layouts/AuthLayout"
import ChatLayout from "./Layouts/ChatLayout"
import DecorationBackground from "./components/DecorationBackground"

import { Toaster } from "react-hot-toast"
import { Navigate, Route, Routes } from "react-router-dom"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"
import PageLoader from "./components/PageLoader"

function App() {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  console.log({ authUser })

  if (isCheckingAuth) {
    return (
      <>
        <DecorationBackground />
        <PageLoader />
      </>
    )
  }

  return (
    <>
      <div className="h-full w-full bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
        {/* DECORATORS - GRID BG & GLOW SHAPES */}
        <DecorationBackground />

        <Routes>
          <Route element={<ChatLayout />}>
            <Route
              path="/"
              element={authUser ? <ChatPage /> : <Navigate to={"/login"} />}
            />
          </Route>

          <Route element={<AuthLayout />}>
            <Route
              path="/login"
              element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
            />
            <Route
              path="/signup"
              element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
            />
          </Route>
        </Routes>

        <Toaster />
      </div>
    </>
  )
}

export default App
