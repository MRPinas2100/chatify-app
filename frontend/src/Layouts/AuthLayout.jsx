import { Outlet } from "react-router-dom"

function AuthLayout() {
  return (
    <main className="flex items-center justify-center w-full h-full bg-transparent">
      <Outlet />
    </main>
  )
}

export default AuthLayout
