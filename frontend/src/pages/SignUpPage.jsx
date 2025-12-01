import { useState } from "react"
import { useAuthStore } from "../store/useAuthStore"

function SignUpPage() {
  const { isSigningUp, signup } = useAuthStore()
  const [FormData, setFormdata] = useState({
    fullName: "",
    email: "",
    password: "",
  })

  const handleSubmit = (event) => {}

  return <div>SignUpPage</div>
}

export default SignUpPage
