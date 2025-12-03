import { Outlet } from "react-router-dom"

function AuthLayout() {
  return (
    <main className=" w-full h-full bg-transparent">
      <Outlet />
    </main>
  )
}

export default AuthLayout
