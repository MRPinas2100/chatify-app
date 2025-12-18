import { Outlet } from "react-router-dom"

export const AuthLayout = () => {
  return (
    <main className="flex items-center justify-center w-full h-full bg-transparent">
      <Outlet />
    </main>
  )
}
