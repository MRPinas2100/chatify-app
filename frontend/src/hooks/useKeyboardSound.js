const keyStrokeSounds = [
  new Audio("/sounds/keystroke1.mp3"),
  new Audio("/sounds/keystroke2.mp3"),
  new Audio("/sounds/keystroke3.mp3"),
  new Audio("/sounds/keystroke4.mp3"),
]

export function useKeyboardSound() {
  const playRandomKeyStrokeSound = () => {
    const randomNumber = Math.floor(Math.random() * keyStrokeSounds.length)
    const randomSound = keyStrokeSounds[randomNumber]

    randomSound.currentTime = 0
    randomSound.play().catch((err) => console.log("Error playing audio: ", err))
  }

  return { playRandomKeyStrokeSound }
}
