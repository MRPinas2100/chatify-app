import { useRef, useState } from "react"
import { useKeyboardSound } from "../hooks/useKeyboardSound"
import { useChatStore } from "../store/useChatStore"
import toast from "react-hot-toast"
import { ImageIcon, SendIcon, XIcon } from "lucide-react"

export const MessageInput = () => {
  const { playRandomKeyStrokeSound } = useKeyboardSound()
  const { sendMessage, isSoundEnabled } = useChatStore()

  const [text, setText] = useState("")
  const [imagePrev, setImagePrev] = useState(null)

  const fileInputRef = useRef(null)

  const handleSendMessage = (event) => {
    event.preventDefault()

    if (!text.trim() && !imagePrev) return
    if (isSoundEnabled) playRandomKeyStrokeSound()

    sendMessage({
      text: text.trim(),
      image: imagePrev,
    })

    setText("")
    setImagePrev(null)

    if (fileInputRef.current) fileInputRef.current.value = null
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]

    if (!file.type.startsWith("image/")) {
      toast.error("Plase select an image file")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => setImagePrev(reader.result)
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePrev(null)
    if (fileInputRef.current) fileInputRef.current.value = null
  }

  const handleClickUploadImage = () => {
    fileInputRef.current?.click()
  }

  const handleChangeMessage = (event) => {
    const { value } = event.target
    setText(value)
    isSoundEnabled && playRandomKeyStrokeSound()
  }

  return (
    <div className="p-4 border-t border-slate-700/50">
      {imagePrev && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePrev}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-slate-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="max-w-3xl mx-auto flex space-x-4"
      >
        <input
          type="text"
          value={text}
          onChange={handleChangeMessage}
          className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4"
          placeholder="Type your message..."
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={handleClickUploadImage}
          className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors ${
            imagePrev ? "text-cyan-500" : ""
          }`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <button
          type="submit"
          disabled={!text.trim() && !imagePrev}
          className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}
