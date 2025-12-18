import { useRef, useState } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { useChatStore } from "../store/useChatStore"
import { LogOutIcon, Volume2Icon, VolumeOffIcon } from "lucide-react"

const mouseClickSound = new Audio("/sounds/mouse-click.mp3")

export const ProfileHeader = () => {
  const { logout, authUser, updateProfile } = useAuthStore()
  const { fullName, profilePic } = authUser

  const { isSoundEnabled, toggleSound } = useChatStore()
  const [selectedImg, setSelectedImage] = useState(null)

  const fileInputRef = useRef(null)

  const handleImageUpload = (event) => {
    const file = event.target.files[0]

    if (!file) return

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = async () => {
      const base64Image = reader.result
      setSelectedImage(base64Image)
      await updateProfile({ profilePic: base64Image })
    }
  }

  const handleClickEventInputFile = () => {
    fileInputRef.current.click()
  }

  const handleClickToggleAudio = () => {
    mouseClickSound.currentTime = 0
    mouseClickSound
      .play()
      .catch((error) => console.log("Audio play failed:", error))
    toggleSound()
  }

  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar online">
            <button
              className="size-14 rounded-full overflow-hidden relative group"
              onClick={handleClickEventInputFile}
            >
              <img
                src={selectedImg || profilePic || "/avatar.png"}
                alt="User image"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change</span>
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div>
            <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
              {fullName}
            </h3>

            <p className="text-slate-400 text-xs">Online</p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={logout}
          >
            <LogOutIcon className="size-5" />
          </button>

          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={handleClickToggleAudio}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
